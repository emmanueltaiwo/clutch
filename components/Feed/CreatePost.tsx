"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ProfileAvatar from "../ProfileAvatar";
import { createNewPost } from "@/services/feed";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types";

const CreatePost = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const [post, setPost] = useState<string>("");

  const hanldePostCreation = async () => {
    try {
      const postResponse = await createNewPost(post);

      toast({
        title: postResponse,
        description: "Your Post Has Been Created! Enjoy Clutch!",
      });
      setPost("");
    } catch (error) {
      throw new Error();
    }
  };

  return (
    <section className="h-[13vh] border-b-[0.5px] flex justify-center items-center flex-col border-gray-500 p-5">
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full flex items-center gap-5 cursor-pointer">
            <ProfileAvatar user={user} />
            <h3 className="text-[14px] md:text-[20px] dark:text-gray-400 text-gray-700 font-[300]">
              Say what&apos;s on your mind
            </h3>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full  items-center gap-4">
              <Textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Say what's on your mind"
              />
            </div>
          </div>
          <DialogClose>
            <DialogFooter>
              <Button onClick={hanldePostCreation} type="submit">
                Post
              </Button>
            </DialogFooter>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CreatePost;
