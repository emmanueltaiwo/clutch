import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import RightPanel from "@/components/RightPanel";
import CommunityContainer from "@/components/communities/CommunityContainer";

const CommunitiesPage = () => {
  return (
    <section className="w-full flex justify-between pb-20">
      <Container>
        <PageHeader>
          <h2 className="font-bold text-[25px] cursor-pointer">Communities</h2>
        </PageHeader>
        <CommunityContainer />
      </Container>
      <RightPanel />
    </section>
  );
};

export default CommunitiesPage;
