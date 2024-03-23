import Container from "@/components/Container";
import RightPanel from "@/components/RightPanel";
import CommunityContainer from "@/components/communities/CommunityContainer";

const CommunitiesPage = () => {
  return (
    <section className="flex justify-between">
      <Container>
        <h2 className="font-bold text-[25px] cursor-pointer p-5 mt-5">
          Communities
        </h2>
        <CommunityContainer />
      </Container>
      <RightPanel />
    </section>
  );
};

export default CommunitiesPage;
