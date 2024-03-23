"use client";

import { FC, useRef } from "react";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createNewComment } from "@/services/feed";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  postId: string;
  user: User;
  postUserId: string;
};

const CreateComment: FC<Props> = ({ postId, user, postUserId }) => {
  const queryClient = useQueryClient();

  const { mutate: mutateCreateComment, isPending } = useMutation({
    mutationFn: (formData: FormData) => createComment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comment", postId] });
    },
  });
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);

  const createComment = async (formData: FormData) => {
    const comment = formData.get("comment")?.toString();

    if (!comment) {
      return toast({
        title: "Comment Is Not Valid",
        description: "An Error Occured because the comment field is empty",
      });
    }

    const response = await createNewComment(postId, comment, postUserId);
    if (!response) {
      return toast({
        title: "An error occurred",
        description: "An Error Occured! Refresh the page and try again later",
      });
    }

    ref.current?.reset();
    return toast({
      title: "Comment created successfully",
      description: "Your comment has been created successfully",
    });
  };

  return (
    <form
      ref={ref}
      action={(formData: FormData) => mutateCreateComment(formData)}
      className="w-[95%] py-5 mx-auto flex flex-col md:flex-row gap-5 md:items-center justify-center"
    >
      <div className="w-full flex items-center gap-5">
        <ProfileAvatar user={user} />

        <Input type="text" placeholder="Post your reply" name="comment" />
      </div>

      <Button disabled={isPending} type="submit">
        {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Reply
      </Button>
    </form>
  );
};

export default CreateComment;
