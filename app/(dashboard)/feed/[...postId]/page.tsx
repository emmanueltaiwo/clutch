import Container from "@/components/Container";
import React from "react";
import PostCard from "@/components/Feed/PostCard";
import {
  fetchAllLikesForPost,
  fetchPostById,
  findAllLikedPost,
} from "@/services/feed";
import ProfileAvatar from "@/components/ProfileAvatar";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";
import PageHeader from "./PageHeader";

const PostDetails = async ({ params }: { params: { postId: string[] } }) => {
  const [username, postId] = params.postId;
  const post = await fetchPostById(postId);

  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;
  const user = (await getUserDocFromFirestore(userId)) as User;

  const [firstName, lastName] = post.user.fullName.split(" ");

  return (
    <Container>
      <PageHeader postUserId={post.userId} userId={userId} />

      <div className="border-b-[0.5px] flex flex-col gap-3 pb-5">
        <PostCard
          postId={postId}
          username={username}
          firstName={firstName}
          lastName={lastName}
          profilePic={post.user.profilePic}
          fullName={post.user.fullName}
          createdAtString={post.createdAtString}
          post={post.post}
          postDetailPage={true}
          totalLikes={post.totalLikes}
          hasLikePost={post.hasLikePost}
        />

        <hr className="w-[95%] border-[0.2px] mx-auto" />

        <div className="w-[95%] py-5 mx-auto flex gap-5 items-center justify-center">
          <div className="w-full flex items-center gap-5">
            <ProfileAvatar user={user} />

            <input
              type="text"
              placeholder="Post your reply"
              className="w-full text-[20px] bg-transparent outline-none focus-within:border-b-[1px] border-gray-500 pb-3"
            />
          </div>

          <button className="w-fit h-fit px-5 py-2 rounded-full bg-[rgb(26,32,44)] dark:bg-[rgb(205,211,226)] hover:bg-[rgb(0,0,0)] hover:dark:bg-[rgb(155,159,168)] text-[rgb(205,211,226)] dark:text-[rgb(26,32,44)] font-semibold">
            Reply
          </button>
        </div>

        <hr className="w-[95%] border-[0.2px] mx-auto" />
      </div>
    </Container>
  );
};

export default PostDetails;
