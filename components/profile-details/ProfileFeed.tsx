"use client";

import { useAppSelector } from "@/lib/hooks";
import { Post } from "@/types";
import { FC, useEffect, useMemo, useState } from "react";
import PostCard from "../Feed/PostCard";
import { fetchSpecificPost, fetchUserProfilePosts } from "@/services/profile";
import SkeletonCard from "../Feed/SkeletonCard";

type Props = {
  userId: string;
};

const ProfileFeed: FC<Props> = ({ userId }) => {
  const profileFeedMode = useAppSelector(
    (state) => state.profileFeedMode.profileFeedMode
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      let funcCall;

      if (profileFeedMode === "posts") {
        funcCall = fetchUserProfilePosts(userId, "posts");
      } else if (profileFeedMode === "likes") {
        funcCall = fetchSpecificPost(userId, "likes");
      } else if (profileFeedMode === "comments") {
        funcCall = fetchSpecificPost(userId, "comments");
      } else {
        console.error("Unexpected profileFeedMode:", profileFeedMode);
        return;
      }

      const response = await funcCall;

      if (typeof response === "undefined") {
        return;
      }

      setShowNoPostsMessage(response.length === 0);

      setPosts(response);
    };

    fetchPosts();
  }, [userId, profileFeedMode]);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto h-full flex flex-col gap-3 my-5">
      <SkeletonCard />
    </div>
  ));

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }, [posts]);

  function renderContent() {
    if (showNoPostsMessage) {
      return (
        <div className="text-center py-5 text-[14px] text-gray-800 dark:text-gray-600">
          This is empty
        </div>
      );
    } else if (posts.length === 0) {
      return skeletonCards;
    } else {
      return sortedPosts.map((post) => {
        return (
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

export default ProfileFeed;
