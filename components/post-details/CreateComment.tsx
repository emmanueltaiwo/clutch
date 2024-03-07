"use client";

import { FC, useRef } from "react";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createNewComment } from "@/services/feed";
import { User } from "@/types";

type Props = {
  postId: string;
  user: User;
};

const CreateComment: FC<Props> = ({ postId, user }) => {
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData: FormData) => {
        const comment = formData.get("comment")?.toString();

        if (!comment) {
          return toast({
            title: "Comment Is Not Valid",
            description: "An Error Occured because the comment field is empty",
          });
        }

        const response = await createNewComment(postId, comment);
        if (!response) {
          return toast({
            title: "An error occurred",
            description:
              "An Error Occured! Refresh the page and try again later",
          });
        }

        ref.current?.reset();
        return toast({
          title: "Comment created successfully",
          description: "Your comment has been created successfully",
        });
      }}
      className="w-[95%] py-5 mx-auto flex gap-5 items-center justify-center"
    >
      <div className="w-full flex items-center gap-5">
        <ProfileAvatar user={user} />

        <Input type="text" placeholder="Post your reply" name="comment" />
      </div>

      <Button type="submit">Reply</Button>
    </form>
  );
};

export default CreateComment;
