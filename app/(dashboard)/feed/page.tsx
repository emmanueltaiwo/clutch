import React from "react";
import FeedToggle from "@/components/Feed/FeedToggle";
import Feed from "@/components/Feed/Feed";
import CreatePost from "@/components/Feed/CreatePost";
import Container from "@/components/Container";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";

const FeedPage = async () => {
  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;

  const user = (await getUserDocFromFirestore(userId)) as User;

  return (
    <Container>
      <FeedToggle />
      <CreatePost user={user} />
      <Feed />
    </Container>
  );
};

export default FeedPage;
