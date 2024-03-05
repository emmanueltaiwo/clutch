"use client";

import Link from "next/link";
import React, { FC, ReactNode, useState } from "react";
import PostAvatar from "./PostAvatar";
import { ReloadIcon, Pencil1Icon } from "@radix-ui/react-icons";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SharePost from "./SharePost";
import LikePost from "./LikePost";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { closeEditPost } from "@/lib/features/editPost/editPostSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast";
import { editPost } from "@/services/feed";
import { useFormStatus } from "react-dom";
import WrapperComponent from "./Wrapper";

type Props = {
  postId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  fullName: string;
  createdAtString: string;
  updatedAtString: string;
  updatedAt: number;
  createdAt: number;
  post: string;
  postDetailPage?: boolean;
  totalLikes: number;
  hasLikePost: boolean;
};

const EditPostButton: FC = () => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return <Button type="submit">Edit Post</Button>;
};

const Children: FC<Props & { isEditPost: boolean }> = ({
  postId,
  username,
  firstName,
  lastName,
  profilePic,
  fullName,
  createdAtString,
  updatedAt,
  createdAt,
  updatedAtString,
  post,
  totalLikes,
  hasLikePost,
  isEditPost,
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [displayedPost, setDisplayedPost] = useState<string>(post);

  return (
    <>
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

        <div className="flex items-center gap-5">
          <p className="font-[100] text-gray-800 text-[12px] dark:text-gray-400">
            Posted {createdAtString}
          </p>

          {updatedAt > createdAt && (
            <p className="font-[400] text-gray-800 text-[12px] dark:text-gray-400 flex items-center gap-1">
              <Pencil1Icon /> {updatedAtString}
            </p>
          )}
        </div>
      </div>

      {isEditPost ? (
        <form
          action={async (formData: FormData) => {
            try {
              const newPost = formData.get("post")?.toString();
              if (!newPost) {
                return toast({
                  title: "Post Failed To Edit",
                  description: "New Post Entry Is Invalid",
                });
              }
              const response = await editPost(postId, newPost);
              if (!response) {
                return toast({
                  title: "An Error Occured!",
                  description: "Refresh page and try again",
                });
              }

              setDisplayedPost(newPost);
              dispatch(closeEditPost());
              return toast({
                title: "Post Edited Succesfully",
                description: "Your Post Has Been Edited! Enjoy Clutch!",
              });
            } catch (error) {
              return toast({
                title: "An Error Occured!",
                description: "Refresh page and try again",
              });
            }
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input type="text" defaultValue={displayedPost} name="post" />
          <EditPostButton />
          <Button type="button" onClick={() => dispatch(closeEditPost())}>
            Cancel
          </Button>
        </form>
      ) : (
        <p className="font-[400] text-gray-800 text-[14px] md:text-[15px] dark:text-gray-200">
          {displayedPost}
        </p>
      )}

      <div className="flex justify-between items-center">
        <button className="text-gray-600 hover:bg-[rgba(58,94,255,0.12)] hover:text-blue-500 transition-all duration-300 px-[8px] py-[6px] rounded-full">
          <ChatBubbleOutlineRoundedIcon fontSize="small" />
        </button>

        <LikePost
          postId={postId}
          totalLikes={totalLikes}
          hasLikePost={hasLikePost}
        />

        <SharePost username={username} postId={postId} />
      </div>
    </>
  );
};

const PostCard: FC<Props> = ({
  postId,
  username,
  firstName,
  lastName,
  profilePic,
  fullName,
  createdAtString,
  updatedAt,
  createdAt,
  updatedAtString,
  post,
  postDetailPage,
  totalLikes,
  hasLikePost,
}) => {
  const isEditPost = useAppSelector((state) => state.editPost.isEditPost);

  return (
    <WrapperComponent
      username={username}
      postId={postId}
      postDetailPage={postDetailPage}
    >
      <Children
        postId={postId}
        username={username}
        firstName={firstName}
        lastName={lastName}
        profilePic={profilePic}
        fullName={fullName}
        createdAtString={createdAtString}
        createdAt={createdAt}
        updatedAt={updatedAt}
        updatedAtString={updatedAtString}
        post={post}
        postDetailPage={postDetailPage}
        totalLikes={totalLikes}
        hasLikePost={hasLikePost}
        isEditPost={isEditPost}
      />
    </WrapperComponent>
  );
};

export default PostCard;
