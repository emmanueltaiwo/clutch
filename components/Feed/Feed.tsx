"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Post, User } from "@/types";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { getUserDocFromFirestore } from "@/services/auth";
import SkeletonCard from "./SkeletonCard";
import { formatDate } from "@/utils/helpers";
import PostCard from "./PostCard";

const Feed = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, "posts"));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const newPosts: Post[] = [];

          await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const post = doc.data() as Post;
              const user = (await getUserDocFromFirestore(post.userId)) as User;

              const generatedPost = {
                postId: post.postId,
                userId: post.userId,
                post: post.post,
                postImage: post.postImage,
                category: post.category,
                createdAt: post.createdAt,
                createdAtString: formatDate(post.createdAt),
                user: {
                  fullName: user.fullName,
                  profilePic: user.profilePic,
                  country: user.country,
                },
              };

              newPosts.push(generatedPost);
            })
          );

          setPosts(newPosts);
          setIsLoading(false);
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
              />
            );
          })}
    </section>
  );
};

export default Feed;
