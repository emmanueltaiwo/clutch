"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Post, User } from "@/types";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getUserDocFromFirestore } from "@/services/auth";
import SkeletonCard from "./SkeletonCard";
import { formatDate } from "@/utils/helpers";
import PostCard from "./PostCard";
import {
  fetchAllLikesForPost,
  fetchNumberOfComment,
  findAllLikedPost,
  getUserCategory,
  getUserFollowingIds,
} from "@/services/feed";
import { useSearchParams } from "next/navigation";

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNoPostsMessage, setShowNoPostsMessage] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        let q;

        if (mode === "for-you" || mode === null) {
          const userCategory = await getUserCategory();
          q = query(
            collection(db, "posts"),
            where("category", "==", userCategory)
          );
        } else if (mode === "following") {
          const followingIds = await getUserFollowingIds();
          q = query(
            collection(db, "posts"),
            where("userId", "in", followingIds)
          );
        } else {
          q = query(collection(db, "posts"));
        }

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const posts: Post[] = [];
          querySnapshot.forEach(async (doc) => {
            const post = doc.data() as Post;
            posts.push(post);
          });

          if ((mode === "for-you" || mode === null) && posts.length === 0) {
            const allPostsQuery = query(collection(db, "posts"));
            const allPostsSnapshot = await getDocs(allPostsQuery);
            allPostsSnapshot.forEach((doc) => {
              const post = doc.data() as Post;
              posts.push(post);
            });
          }

          const promises = posts.map(async (post) => {
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
              totalComment: totalComment,
              user: {
                username: user.username,
                fullName: user.fullName,
                profilePic: user.profilePic,
                country: user.country,
              },
            };
          });

          await Promise.all(promises).then((newPosts) => {
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
  }, [mode]);

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
          Ooops! No post was found
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
