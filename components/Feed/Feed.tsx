"use client";

import React, { useEffect, useState } from "react";
import { Post, User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { getUserDocFromFirestore } from "@/services/auth";
import SkeletonCard from "./SkeletonCard";
import { formatDate } from "@/utils/helpers";

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
        throw error;
      }
    };

    fetchAllPosts();
  }, []);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-full h-full flex flex-col gap-3">
      <SkeletonCard />
    </div>
  ));

  const sortedPosts = [...posts].sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  return (
    <section className="w-full md:w-[90%] md:mx-auto h-full flex flex-col gap-5 my-5">
      {isLoading || posts.length === 0
        ? skeletonCards
        : sortedPosts.map((post) => {
            const [firstName, lastName] = post.user.fullName.split(" ");

            return (
              <Link
                href={`/feed/${firstName.toLowerCase()}-${lastName.toLowerCase()}/${
                  post.postId
                }`}
                key={post.postId}
                className="w-full border-[1px] border-gray-800 dark:border-gray-700 md:rounded-lg p-3 flex flex-col gap-5"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      post.user.profilePic.length < 1 ||
                      post.user.profilePic === undefined
                        ? "/assets/Images/logoIcon.svg"
                        : post.user.profilePic
                    }
                    width={50}
                    height={50}
                    alt={post.user.fullName}
                    className="rounded-full border-[1px] border-gray-500 dark:invert-0 invert"
                  />

                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-800 text-[15px] dark:text-gray-400">
                      {post.user.fullName}
                    </h4>
                    <span className="font-[100] text-gray-800 text-[12px] dark:text-gray-400">
                      {post.createdAtString}
                    </span>
                  </div>
                </div>

                <p className="font-[400] text-gray-800 text-[14px] md:text-[15px] dark:text-gray-100">
                  {post.post}
                </p>
              </Link>
            );
          })}
    </section>
  );
};

export default Feed;
