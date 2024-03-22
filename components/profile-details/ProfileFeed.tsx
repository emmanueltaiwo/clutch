"use client";

import { useAppSelector } from "@/lib/hooks";
import { Post } from "@/types";
import { FC, useMemo } from "react";
import PostCard from "../Feed/PostCard";
import { fetchSpecificPost, fetchUserProfilePosts } from "@/services/profile";
import SkeletonCard from "../Feed/SkeletonCard";
import { useQuery } from "@tanstack/react-query";

type Props = {
  userId: string;
};

const ProfileFeed: FC<Props> = ({ userId }) => {
  const profileFeedMode = useAppSelector(
    (state) => state.profileFeedMode.profileFeedMode
  );

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["profileFeed", userId, profileFeedMode],
    queryFn: async () => {
      let funcCall;

      if (profileFeedMode === "posts") {
        funcCall = fetchUserProfilePosts(userId, "posts");
      } else if (profileFeedMode === "likes") {
        funcCall = fetchSpecificPost(userId, "likes");
      } else if (profileFeedMode === "comments") {
        funcCall = fetchSpecificPost(userId, "comments");
      } else {
        return [];
      }

      const response = await funcCall;

      return response;
    },
    staleTime: 0,
  });

  const skeletonCards = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="w-[95%] mx-auto h-full flex flex-col gap-3 my-5"
        >
          <SkeletonCard />
        </div>
      )),
    []
  );

  const sortedPosts = useMemo(() => {
    if (posts) {
      return [...posts].sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
    }
    return [];
  }, [posts]);

  function renderContent() {
    if (isLoading) {
      return skeletonCards;
    } else if (isError) {
      return (
        <div className="text-center py-5 text-[14px] text-red-600 dark:text-red-400">
          Error fetching data
        </div>
      );
    } else if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-5 text-[14px] text-gray-800 dark:text-gray-600">
          This is empty
        </div>
      );
    } else {
      return sortedPosts.map((post) => (
        <PostCard
          key={post.postId}
          postId={post.postId}
          username={post.user.username}
          profilePic={post.user.profilePic}
          fullName={post.user.fullName}
          createdAtString={post.createdAtString}
          updatedAtString={post.updatedAtString}
          updatedAt={post.updatedAt}
          createdAt={post.createdAt}
          post={post.post}
          totalLikes={post.totalLikes}
          totalComment={post.totalComment}
          hasLikePost={post.hasLikePost}
          defaultUserId={userId}
        />
      ));
    }
  }

  return (
    <section className="w-full md:mx-auto h-full flex flex-col my-5">
      {renderContent()}
    </section>
  );
};

export default ProfileFeed;
