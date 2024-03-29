import Container from "@/components/Container";
import {
  fetchCommunityById,
  verifyCommunityExists,
} from "@/services/communities";
import { handleCookies } from "@/services/auth";
import { redirect } from "next/navigation";
import CommunityMembers from "@/components/communities/CommunityMembers";
import CommunityHeader from "@/components/communities/CommunityHeader";

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

  const community = await fetchCommunityById(communityId);

  return (
    <main>
      <div className="flex justify-between">
        <Container>
          <CommunityHeader userId={userId} community={community} />
        </Container>
        <CommunityMembers
          userId={userId}
          communityCreator={communityExists.creatorId}
          communityId={communityId}
        />
      </div>
    </main>
  );
};

export default CommunityPage;
