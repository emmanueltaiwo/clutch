"use client";

import { FC } from "react";
import PostCard from "../Feed/PostCard";
import CreateComment from "./CreateComment";
import { Post, User } from "@/types";
import PageHeader from "./PageHeader";
import CommentContainer from "./CommentContainer";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "@/services/feed";
import Container from "../Container";
import SkeletonCard from "../Feed/SkeletonCard";

type Props = {
  postId: string;
  username: string;
  userId: string;
  user: User;
};

const PostDetailContainer: FC<Props> = ({ postId, username, userId, user }) => {
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post | boolean>({
    queryKey: ["feed-posts", postId],
    queryFn: async () => await fetchPostById(postId),
    staleTime: 0,
  });

  if (isLoading) {
    const skeletonCards = Array.from({ length: 1 }, (_, index) => (
      <div key={index} className="w-[95%] mx-auto h-full flex flex-col gap-3 pb-10">
        <SkeletonCard />
      </div>
    ));
    return (
      <div>
        <PageHeader postId={postId} postUserId={userId} userId={userId} />
        {skeletonCards}
        <CommentContainer postId={postId} defaultUserId={userId} />
      </div>
    );
  }

  if (isError || typeof post === "boolean" || !post) {
    return (
      <Container>
        <p className="text-white font-bold text-[40px] text-center mt-20">
          {isError ? "An error occurred." : "Post does not exist."}
        </p>
      </Container>
    );
  }

  return (
    <>
      <PageHeader postId={postId} postUserId={post.userId} userId={userId} />

      <section className="border-b-[0.5px] flex flex-col gap-3 pb-5">
        <PostCard
          postId={postId}
          username={username}
          profilePic={post.user.profilePic}
          fullName={post.user.fullName}
          createdAtString={post.createdAtString}
          updatedAtString={post.updatedAtString}
          updatedAt={post.updatedAt}
          createdAt={post.createdAt}
          post={post.post}
          postDetailPage={true}
          totalLikes={post.totalLikes}
          hasLikePost={post.hasLikePost}
          totalComment={post.totalComment}
          defaultUserId={userId}
        />

        <hr className="w-[95%] border-[0.2px] mx-auto" />

        <CreateComment user={user} postId={postId} />

        <hr className="w-[95%] border-[0.2px] mx-auto" />
      </section>

      <CommentContainer postId={postId} defaultUserId={userId} />
    </>
  );
};

export default PostDetailContainer;
