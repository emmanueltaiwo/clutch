import Container from "@/components/Container";
import CommunityMembers from "@/components/communities/CommunityMembers";
import PostDetailContainer from "@/components/post-details/PostDetailContainer";
import { handleCookies, getUserDocFromFirestore } from "@/services/auth";
import { verifyCommunityPostExists } from "@/services/communities";
import { User } from "@/types";
import { redirect } from "next/navigation";

const CommunityPostDetail = async ({
  params,
}: {
  params: { postId: string };
}) => {
  const postId = params.postId;

  const userId = await handleCookies("get", "USER_ID");
  if (typeof userId === "boolean") {
    redirect("/login");
  }

  const postExists = await verifyCommunityPostExists(postId);

  if (!postExists) {
    return <Container>Post does not exist</Container>;
  }

  const user = (await getUserDocFromFirestore(userId)) as User;

  return (
    <main>
      <div className="flex justify-between">
        <Container>
          <PostDetailContainer
            user={user}
            postId={postId}
            userId={userId}
            communityPage={true}
          />
        </Container>
        <CommunityMembers userId={userId} />
      </div>
    </main>
  );
};

export default CommunityPostDetail;
