import Container from "@/components/Container";
import RightPanel from "@/components/RightPanel";
import NotificationContainer from "@/components/notification/NotificationContainer";

const FeedPage = async () => {
  return (
    <section className="flex justify-between">
      <Container>
        <NotificationContainer />
      </Container>
      <RightPanel />
    </section>
  );
};

export default FeedPage;
