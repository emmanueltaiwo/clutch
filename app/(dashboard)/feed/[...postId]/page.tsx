import Container from "@/components/Container";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";
import PostDetailContainer from "@/components/post-details/PostDetailContainer";

const PostDetails = async ({ params }: { params: { postId: string[] } }) => {
  const [username, postId] = params.postId;

  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;
  const user = (await getUserDocFromFirestore(userId)) as User;

  return (
    <Container>
      <PostDetailContainer
        user={user}
        postId={postId}
        username={username}
        userId={userId}
      />
    </Container>
  );
};

export default PostDetails;
