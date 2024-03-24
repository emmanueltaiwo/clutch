import Container from "@/components/Container";
import RightPanel from "@/components/RightPanel";
import NotificationContainer from "@/components/notification/NotificationContainer";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";

const FeedPage = async () => {
  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;

  const user = (await getUserDocFromFirestore(userId)) as User;

  return (
    <section className="flex justify-between">
      <Container>
        <NotificationContainer user={user} />
      </Container>
      <RightPanel />
    </section>
  );
};

export default FeedPage;
