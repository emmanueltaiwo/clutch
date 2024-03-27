import Container from "@/components/Container";
import { verifyCommunityExists } from "@/services/communities";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { redirect } from "next/navigation";
import CommunityMembers from "@/components/communities/CommunityMembers";

const CommunityPage = async ({ params }: { params: { slug: string } }) => {
  const communityId = params.slug;
  const communityExists = await verifyCommunityExists(communityId);

  const userId = await handleCookies("get", "USER_ID");
  if (typeof userId === "boolean") {
    redirect("/login");
  }

  if (!communityExists.exists) {
    return <Container>Community does not exist</Container>;
  }

  const communityCreator = await getUserDocFromFirestore(
    communityExists.creatorId
  );
  if (typeof communityCreator === "boolean") redirect("/login");

  return (
    <main>
      <div className="flex justify-between">
        <Container>{params.slug}</Container> <CommunityMembers communityId={communityId} />
      </div>
    </main>
  );
};

export default CommunityPage;
