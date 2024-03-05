"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Post, User } from "@/types";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { getUserDocFromFirestore } from "@/services/auth";
import SkeletonCard from "./SkeletonCard";
import { formatDate } from "@/utils/helpers";
import PostCard from "./PostCard";
import { fetchAllLikesForPost, findAllLikedPost } from "@/services/feed";

const Feed = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, "posts"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const promises = querySnapshot.docs.map(async (doc) => {
            const post = doc.data() as Post;
            const user = (await getUserDocFromFirestore(post.userId)) as User;
            const likeCount = await fetchAllLikesForPost(post.postId);
            const totalLikes = likeCount.length;
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
              hasLikePost: hasLikePost,
              totalLikes: totalLikes,
              user: {
                fullName: user.fullName,
                profilePic: user.profilePic,
                country: user.country,
              },
            };
          });

          Promise.all(promises).then((newPosts) => {
            setPosts(newPosts);
          });
        });

        return () => unsubscribe();
      } catch (error) {
        throw new Error();
      } finally {
        setIsLoading(false);
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

  return (
    <section className="w-full md:mx-auto h-full flex flex-col my-5">
      {isLoading || posts.length === 0
        ? skeletonCards
        : sortedPosts.map((post) => {
            const [firstName, lastName] = post.user.fullName.split(" ");
            const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

            return (
              <PostCard
                key={post.postId}
                postId={post.postId}
                username={username}
                firstName={firstName}
                lastName={lastName}
                profilePic={post.user.profilePic}
                fullName={post.user.fullName}
                createdAtString={post.createdAtString}
                post={post.post}
                totalLikes={post.totalLikes}
                hasLikePost={post.hasLikePost}
              />
            );
          })}
    </section>
  );
};

export default Feed;
