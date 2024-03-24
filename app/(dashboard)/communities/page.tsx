import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import RightPanel from "@/components/RightPanel";
import CommunityContainer from "@/components/communities/CommunityContainer";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";

const CommunitiesPage = async () => {
  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;

  const user = (await getUserDocFromFirestore(userId)) as User;

  return (
    <section className="w-full flex justify-between pb-20">
      <Container>
        <PageHeader user={user}>
          <h2 className="font-bold text-[25px] cursor-pointer">Communities</h2>
        </PageHeader>
        <CommunityContainer />
      </Container>
      <RightPanel />
    </section>
  );
};

export default CommunitiesPage;
