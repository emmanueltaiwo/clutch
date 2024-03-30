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
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createCommunityPost } from "@/services/communities";
import { getUserDocFromFirestore } from "@/services/auth";
import { DocumentData } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const CreateCommunityPost = ({
  communityId,
  userId,
}: {
  communityId: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [post, setPost] = useState<string>("");

  const { data, isLoading } = useQuery<DocumentData | boolean>({
    queryKey: ["user"],
    queryFn: async () => await getUserDocFromFirestore(userId),
  });

  const { mutate: mutateCreatePost } = useMutation({
    mutationFn: () => hanldePostCreation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-posts", communityId],
      });
    },
  });

  const hanldePostCreation = async () => {
    try {
      const postResponse = await createCommunityPost(post, communityId);

      toast({
        description: postResponse,
      });
      setPost("");
    } catch (error) {
      throw new Error();
    }
  };

  if (data && typeof data === "boolean") return;

  const user = data as User;

  return (
    <section className="h-[13vh] border-b-[0.5px] flex justify-center items-center flex-col border-gray-500 p-5">
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
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
                <Button onClick={() => mutateCreatePost()} type="submit">
                  Post
                </Button>
              </DialogFooter>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default CreateCommunityPost;
