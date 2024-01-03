import React from "react";
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

const CreatePost = () => {
  return (
    <section className="h-[13vh] border-b-[0.5px] flex justify-center items-center flex-col border-gray-500 p-5">
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full flex items-center gap-5 cursor-pointer">
            <ProfileAvatar />
            <h3 className="text-[20px] dark:text-gray-400 text-gray-700 font-[300]">
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
              <Textarea placeholder="Say what's on your mind" />
            </div>
          </div>
          <DialogClose>
            <DialogFooter>
              <Button type="submit">Post</Button>
            </DialogFooter>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CreatePost;
