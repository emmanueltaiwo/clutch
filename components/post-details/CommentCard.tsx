"use client";

import { FC, useEffect, useState } from "react";
import { Comment } from "@/types";
import Link from "next/link";
import PostAvatar from "@/components/Feed/PostAvatar";
import { Pencil1Icon, ClockIcon } from "@radix-ui/react-icons";
import AdminPostOptions from "./AdminPostOptions";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditPostButton } from "@/components/Feed/PostCard";
import { closeEditComment } from "@/lib/features/editComment/editCommentSlice";
import { useToast } from "@/components/ui/use-toast";
import { editComment } from "@/services/feed";
import { editCommunityComment } from "@/services/communities";

type Props = {
  comment: Comment;
  defaultUserId: string;
  communityPage?: boolean;
};

const CommentCard: FC<Props> = ({ comment, defaultUserId, communityPage }) => {
  const {
    commentId,
    userId,
    commentText,
    createdAt,
    updatedAt,
    user,
    createdAtString,
    updatedAtString,
  } = comment;
  const { toast } = useToast();
  const [displayedComment, setDisplayedComment] = useState<string>(commentText);
  const dispatch = useAppDispatch();
  const { fullName, profilePic } = user;
  const [firstName, lastName] = fullName.split(" ");

  const [commentCreatedByUser, setCommentCreatedByUser] =
    useState<boolean>(false);
  const edit = useAppSelector((state) => state.editComment);
  const { editUserId, editCommentId, isEditComment } = edit;

  useEffect(() => {
    if (userId === defaultUserId) {
      return setCommentCreatedByUser(true);
    }

    return setCommentCreatedByUser(false);
  }, [userId, defaultUserId]);

  return (
    <div className="flex flex-col gap-5 p-5 border-t-[1px] border-b-[1px] border-gray-800 dark:border-gray-700 hover:bg-[rgba(48,48,48,0.24)] transition-all duration-300">
      <div className="flex justify-between items-center gap-3">
        <Link
          href={`/${firstName.toLowerCase()}${lastName.toLowerCase()}`}
          className="flex items-center gap-3"
        >
          <PostAvatar profilePic={profilePic} fullName={fullName} />

          <div className="flex flex-col hover:underline underline-offset-4 decoration-[0.5px]">
            <h4 className="font-bold text-gray-800 text-[15px] dark:text-gray-400">
              {fullName}
            </h4>
            <span className="font-[100] text-gray-800 text-[12px] dark:text-gray-400">
              @{firstName.toLowerCase()}
              {lastName.toLowerCase()}
            </span>
          </div>
        </Link>

        <div className="flex flex-col md:flex-row items-center">
          <p className="p-2 font-[100] text-gray-800 text-[12px] dark:text-gray-400 flex items-center gap-1">
            <ClockIcon /> {createdAtString}
          </p>

          {updatedAt > createdAt && (
            <p className="p-2 font-[400] text-gray-800 text-[12px] dark:text-gray-400 flex items-center gap-1">
              <Pencil1Icon /> {updatedAtString}
            </p>
          )}

          {commentCreatedByUser && (
            <AdminPostOptions
              userId={userId}
              type="comment"
              postId={commentId}
              communityPage={communityPage}
            />
          )}
        </div>
      </div>

      {isEditComment &&
      editCommentId === commentId &&
      editUserId === defaultUserId ? (
        <form
          action={async (formData: FormData) => {
            try {
              const newComment = formData.get("comment")?.toString();
              if (!newComment) {
                return toast({
                  title: "Post Failed To Edit",
                  description: "New Post Entry Is Invalid",
                });
              }
              let response: boolean;

              if (communityPage) {
                response = await editCommunityComment(commentId, newComment);
              } else {
                response = await editComment(commentId, newComment);
              }

              if (!response) {
                return toast({
                  title: "An Error Occurred!",
                  description: "Refresh page and try again",
                });
              }

              setDisplayedComment(newComment);
              dispatch(closeEditComment());
              return toast({
                title: "Comment Edited Successfully",
                description: "Your Comment Has Been Edited! Enjoy Clutch!",
              });
            } catch (error) {
              return toast({
                title: "An Error Occurred!",
                description: "Refresh page and try again",
              });
            }
          }}
          className="flex flex-col md:flex-row w-full md:items-center space-x-2 gap-2"
        >
          <Input type="text" defaultValue={displayedComment} name="comment" />
          <div className="flex items-center gap-2">
            <EditPostButton />
            <Button type="button" onClick={() => dispatch(closeEditComment())}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <p className="font-[400] text-gray-800 text-[14px] md:text-[15px] dark:text-gray-200">
          {displayedComment}
        </p>
      )}
    </div>
  );
};

export default CommentCard;
