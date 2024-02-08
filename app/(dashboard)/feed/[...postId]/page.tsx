import Container from "@/components/Container";
import React from "react";
import PostCard from "@/components/Feed/PostCard";
import { fetchPostById } from "@/services/feed";
import BackButton from "./BackButton";

const PostDetails = async ({ params }: { params: { postId: string[] } }) => {
  const [username, postId] = params.postId;
  const post = await fetchPostById(postId);

  const [firstName, lastName] = post.user.fullName.split(" ");

  return (
    <Container>
      <div className="w-full flex gap-5 items-center h-[11vh] px-5">
        <BackButton />

        <h4 className="dark:text-white font-bold text-[25px]">Post</h4>
      </div>

      <div className="border-b-[0.5px] flex flex-col gap-3">
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
        />
      </div>
    </Container>
  );
};

export default PostDetails;
