import Container from "@/components/Container";
import {
  fetchCommunityById,
  verifyCommunityExists,
  fetchAllCommunityMembers,
} from "@/services/communities";
import { handleCookies } from "@/services/auth";
import { redirect } from "next/navigation";
import CommunityMembers from "@/components/communities/CommunityMembers";
import CommunityHeader from "@/components/communities/CommunityHeader";
import CommunityFeed from "@/components/communities/CommunityFeed";
import CreateCommunityPost from "@/components/communities/CreateCommunityPost";
import { Card } from "@/components/ui/card";

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
  const isMember = communityMembers.some((member) => member.userId === userId);

  return (
    <main>
      <div className="flex justify-between">
        <Container>
          <CommunityHeader userId={userId} community={community} />
          {isMember ? (
            <>
              <CreateCommunityPost communityId={communityId} userId={userId} />
              <CommunityFeed communityId={communityId} />
            </>
          ) : (
            <Card className="w-[95%] mx-auto text-center p-5 mt-5">
              <p>You need to be a member to have access to this features</p>
            </Card>
          )}
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
