"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Post, User } from "@/types";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { getUserDocFromFirestore } from "@/services/auth";
import SkeletonCard from "./SkeletonCard";
import { formatDate } from "@/utils/helpers";
import PostCard from "./PostCard";
import {
  fetchAllLikesForPost,
  fetchNumberOfComment,
  findAllLikedPost,
} from "@/services/feed";

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const q = query(collection(db, "posts"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const promises = querySnapshot.docs.map(async (doc) => {
            const post = doc.data() as Post;
            const user = (await getUserDocFromFirestore(post.userId)) as User;
            const likeCount = await fetchAllLikesForPost(post.postId);
            const totalLikes = likeCount.length;
            const totalComment = await fetchNumberOfComment(post.postId);
            const likedPosts = await findAllLikedPost();
            let hasLikePost: boolean = false;
            likedPosts.forEach((favPost) => {
              if (favPost.postId === post.postId) {
                hasLikePost = true;
              }
            });

            return {
              postId: post.postId,
              userId: post.userId,
              post: post.post,
              postImage: post.postImage,
              category: post.category,
              createdAt: post.createdAt,
              createdAtString: formatDate(post.createdAt),
              updatedAtString: formatDate(post.updatedAt),
              updatedAt: post.updatedAt,
              hasLikePost: hasLikePost,
              totalLikes: totalLikes,
              totalComment:totalComment,
              user: {
                username: user.username,
                fullName: user.fullName,
                profilePic: user.profilePic,
                country: user.country,
              },
            };
          });

          Promise.all(promises).then((newPosts) => {
            setPosts(newPosts);

            setShowNoPostsMessage(newPosts.length === 0);
          });
        });

        return () => unsubscribe();
      } catch (error) {
        throw new Error();
      }
    };

    fetchAllPosts();
  }, []);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto h-full flex flex-col gap-3">
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
          Be the first to create a post on clutch!
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
