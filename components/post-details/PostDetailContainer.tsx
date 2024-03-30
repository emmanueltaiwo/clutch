"use client";

import { FC } from "react";
import PostCard from "../Feed/PostCard";
import CreateComment from "./CreateComment";
import { Post, User } from "@/types";
import PostDetailHeader from "./PostDetailHeader";
import CommentContainer from "./CommentContainer";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "@/services/feed";
import Container from "../Container";
import SkeletonCard from "../Feed/SkeletonCard";
import { fetchCommunityPostById } from "@/services/communities";

type Props = {
  postId: string;
  userId: string;
  user: User;
  communityPage?: boolean;
};

const PostDetailContainer: FC<Props> = ({
  postId,
  userId,
  user,
  communityPage,
}) => {
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post>({
    queryKey: communityPage
      ? ["community-post", postId]
      : ["feed-posts", postId],
    queryFn: async () =>
      communityPage
        ? await fetchCommunityPostById(postId)
        : await fetchPostById(postId),
    staleTime: 0,
  });

  const skeletonCards = Array.from({ length: 1 }, (_, index) => (
    <div
      key={index}
      className="w-[95%] mx-auto h-full flex flex-col gap-3 pb-10"
    >
      <SkeletonCard />
    </div>
  ));

  if (isLoading) {
    return (
      <div>
        <PostDetailHeader postId={postId} postUserId={userId} userId={userId} />
        {skeletonCards}
        <CommentContainer postId={postId} defaultUserId={userId} />
      </div>
    );
  }

  if (isError) {
    return (
      <Container>
        <p className="text-white font-bold text-[40px] text-center mt-20">
          {isError ? "An error occurred." : "Post does not exist."}
        </p>
      </Container>
    );
  }

  if (!post) {
    return (
      <div>
        <PostDetailHeader postId={postId} postUserId={userId} userId={userId} />
        {skeletonCards}
        <CommentContainer postId={postId} defaultUserId={userId} />
      </div>
    );
  }

  return (
    <>
      <PostDetailHeader
        postId={postId}
        postUserId={post.userId}
        userId={userId}
        communityPage={communityPage}
      />

      <section className="border-b-[0.5px] flex flex-col gap-3 pb-5">
        <PostCard
          postId={postId}
          userId={post.userId}
          username={post.user.username}
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
          communityPage={communityPage}
        />

        <hr className="w-[95%] border-[0.2px] mx-auto" />

        <CreateComment
          communityPage={communityPage}
          postUserId={post.userId}
          user={user}
          postId={postId}
        />

        <hr className="w-[95%] border-[0.2px] mx-auto" />
      </section>

      <CommentContainer
        communityPage={communityPage}
        postId={postId}
        defaultUserId={userId}
      />
    </>
  );
};

export default PostDetailContainer;
