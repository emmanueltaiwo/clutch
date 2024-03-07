"use server";

import { db } from "@/firebase";
import { Post, User } from "@/types";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getUserDocFromFirestore, handleCookies } from "./auth";
import {
  fetchAllLikesForPost,
  fetchNumberOfComment,
  findAllLikedPost,
} from "./feed";
import { formatDate } from "@/utils/helpers";

export const verifyUserProfileExists = async (
  username: string
): Promise<{ exists: boolean; userId: string }> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("username", "==", username))
    );

    if (!querySnapshot.empty) {
      const userId = querySnapshot.docs[0].id;
      return { exists: true, userId };
    } else {
      return { exists: false, userId: "" };
    }
  } catch (error: any) {
    throw error;
  }
};

export const fetchUserProfilePosts = async (userId: string, type: string) => {
  try {
    const allPosts: Post[] = [];
    const q = query(collection(db, type), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const post = doc.data() as Post;

        const user = (await getUserDocFromFirestore(userId)) as User;
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

        const fullPost = {
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

        allPosts.push(fullPost);
      })
    );

    return allPosts;
  } catch (error: any) {
    throw error;
  }
};

export const fetchSpecificPost = async (userId: string, type: string) => {
  try {
    const allPosts: Post[] = [];
    const q = query(collection(db, type), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const postId = doc.data().postId;

        const qPost = query(
          collection(db, "posts"),
          where("postId", "==", postId)
        );
        const queryPostSnapshot = await getDocs(qPost);

        await Promise.all(
          queryPostSnapshot.docs.map(async (doc) => {
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

            const fullPost = {
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

            allPosts.push(fullPost);
          })
        );
      })
    );

    return allPosts;
  } catch (error: any) {
    throw error;
  }
};

export const editProfile = async (
  fullName: string,
  username: string,
  bio: string
): Promise<string | boolean> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (typeof userId === "boolean")
      return "An Error Occurred! Refresh the page and try again";

    let q = query(collection(db, "users"), where("username", "==", username));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.size > 1) {
      return "Username is taken! Please try using another username.";
    } else if (querySnapshot.size === 1) {
      const userDoc = querySnapshot.docs[0];
      const existingUserId = userDoc.id;

      if (existingUserId !== userId) {
        return "Username is taken! Please try using another username.";
      }
    }

    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      fullName: fullName,
      bio: bio,
      username: username,
    });

    return true;
  } catch (error: any) {
    throw error;
  }
};

