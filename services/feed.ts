"use server";

import { db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getUserDocFromFirestore, handleCookies } from "./auth";
import { Post, User } from "@/types";
import { formatDate } from "@/utils/helpers";

export const createNewPost = async (post: string): Promise<string> => {
  try {
    if (post.length < 1) {
      return "Input cannot be empty";
    }

    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string") return "UserId Not Found";

    const userDoc = await getUserDocFromFirestore(userId);
    if (userDoc === false) return "User Not Found";

    const user = userDoc as User;
    const userInterest = user.interests[0];
    const postId = generatePostId(post);

    const newPost = {
      userId: userId,
      postId: postId,
      category: userInterest,
      post: post,
      postImage: "",
      createdAt: new Date().getTime(),
    };
    await setDoc(doc(db, "posts", postId), newPost);

    return "Post Created Successfully";
  } catch (error) {
    throw new Error();
  }
};

export const generatePostId = (post: string): string => {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const postIdBase = `${year}${month}${day}${hours}${minutes}${seconds}${post}`;

  const postId = postIdBase.substring(0, 15);

  return postId;
};

export const fetchPostById = async (postId: string): Promise<Post> => {
  try {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error();
    const postDetail = docSnap.data() as Post;

    const user = (await getUserDocFromFirestore(postDetail.userId)) as User;

    const post: Post = {
      postId: postId,
      userId: postDetail.userId,
      post: postDetail.post,
      postImage: postDetail.postImage,
      category: postDetail.category,
      createdAt: postDetail.createdAt,
      createdAtString: formatDate(postDetail.createdAt),
      user: {
        fullName: user.fullName,
        profilePic: user.profilePic,
        country: user.country,
      },
    };

    return post;
  } catch (error) {
    throw new Error();
  }
};
