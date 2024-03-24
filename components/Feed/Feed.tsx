"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Post } from "@/types";
import SkeletonCard from "./SkeletonCard";
import PostCard from "./PostCard";
import { fetchFeedPosts } from "@/services/feed";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";

const Feed = () => {
  const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { data: posts, refetch } = useQuery<Post[]>({
    queryKey: ["feed-posts"],
    queryFn: async () => await fetchFeedPosts(mode),
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [mode, refetch]);

  useEffect(() => {
    setIsLoading(true);
    refetch().then(() => {
      setIsLoading(false);
    });
  }, [mode, refetch]);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto h-full flex flex-col gap-3">
      <SkeletonCard />
    </div>
  ));

  const sortedPosts = useMemo(() => {
    return (
      posts &&
      [...posts].sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  }, [posts]);

  if (posts && posts.length === 0) {
    return (
      <Card className="w-[95%] mx-auto text-center p-5 mt-5">
        <p>No posts was found</p>
      </Card>
    );
  }

  function renderContent() {
    if (showNoPostsMessage) {
      return (
        <div className="text-center py-5 text-[14px] text-gray-800 dark:text-gray-600">
          Ooops! No post was found
        </div>
      );
    } else if (isLoading || !posts) {
      return skeletonCards;
    } else {
      return sortedPosts?.map((post) => {
        return (
          <PostCard
            key={post.postId}
            postId={post.postId}
            userId={post.userId}
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
            defaultUserId=""
          />
        );
      });
    }
  }

  return (
    <section className="w-full md:mx-auto h-full flex flex-col my-5">
      {renderContent()}
    </section>
  );
};

export default Feed;
