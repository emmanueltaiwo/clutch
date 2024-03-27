import Container from "@/components/Container";
import {
  fetchAllCommunityMembers,
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

  const communityMembers = await fetchAllCommunityMembers(communityId);

  return (
    <main>
      <div className="flex justify-between">
        <Container>
          <CommunityHeader
            userId={userId}
            communityMembers={communityMembers}
            community={community}
          />
        </Container>
        <CommunityMembers
          communityCreator={communityExists.creatorId}
          communityId={communityId}
        />
      </div>
    </main>
  );
};

export default CommunityPage;
