import Container from "@/components/Container";
import React from "react";
import PostCard from "@/components/Feed/PostCard";
import { fetchPostById } from "@/services/feed";
import ProfileAvatar from "@/components/ProfileAvatar";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";
import PageHeader from "./PageHeader";
import { Button } from "@/components/ui/button";

const PostDetails = async ({ params }: { params: { postId: string[] } }) => {
  const [username, postId] = params.postId;
  const post = await fetchPostById(postId);

  if (typeof post === "boolean") {
    return (
      <Container>
        <p className="text-white font-bold text-[40px] text-center mt-20">
          Post Does Not Exist
        </p>
      </Container>
    );
  }

  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;
  const user = (await getUserDocFromFirestore(userId)) as User;

  const [firstName, lastName] = post.user.fullName.split(" ");

  return (
    <Container>
      <PageHeader postId={postId} postUserId={post.userId} userId={userId} />

      <div className="border-b-[0.5px] flex flex-col gap-3 pb-5">
        <PostCard
          postId={postId}
          username={username}
          firstName={firstName}
          lastName={lastName}
          profilePic={post.user.profilePic}
          fullName={post.user.fullName}
          createdAtString={post.createdAtString}
          updatedAtString={post.updatedAtString}
          updatedAt={post.updatedAt}
          createdAt={post.createdAt}
          post={post.post}
          postDetailPage={true}
          totalLikes={post.totalLikes}
          hasLikePost={post.hasLikePost}
        />

        <hr className="w-[95%] border-[0.2px] mx-auto" />

        <form className="w-[95%] py-5 mx-auto flex gap-5 items-center justify-center">
          <div className="w-full flex items-center gap-5">
            <ProfileAvatar user={user} />

            <input
              type="text"
              placeholder="Post your reply"
              className="w-full text-[20px] mt-2 bg-transparent outline-none focus-within:border-b-[1px] border-gray-500 pb-3"
            />
          </div>

          <Button type="submit">Reply</Button>
        </form>

        <hr className="w-[95%] border-[0.2px] mx-auto" />
      </div>
    </Container>
  );
};

export default PostDetails;
