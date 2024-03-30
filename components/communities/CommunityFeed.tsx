"use client";

import { FC, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommunityPost } from "@/types";
import { fetchAllCommunityPost } from "@/services/communities";
import SkeletonCard from "../Feed/SkeletonCard";
import { Card } from "../ui/card";
import PostCard from "../Feed/PostCard";

type Props = {
  communityId: string;
};

const CommunityFeed: FC<Props> = ({ communityId }) => {
  const { data: posts, isLoading } = useQuery<CommunityPost[]>({
    queryKey: ["community-posts", communityId],
    queryFn: async () => await fetchAllCommunityPost(communityId),
  });

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto mt-5 flex flex-col gap-7">
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
        <p>No post was found</p>
      </Card>
    );
  }

  function renderContent() {
    if (isLoading || !posts) {
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
            communityPage={true}
            communityId={communityId}
          />
        );
      });
    }
  }

  return (
    <section className="w-full md:mx-auto pb-14 flex flex-col">
      {renderContent()}
    </section>
  );
};

export default CommunityFeed;
