import Banner from "@/components/Home/Banner";
import Contributors from "@/components/Home/Contributors";
import Features from "@/components/Home/Features";
import Layout from "@/components/Home/layout";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { getSessionStatus } from "@/lib/session";

const landingPage = (isAuthenticated: boolean) => {
  return (
    <Layout isAuthenticated={isAuthenticated}>
      <main className="flex flex-col w-full h-full bg-[rgba(2,2,26)]">
        <Banner />
        <Features />
        <Contributors />
      </main>
    </Layout>
  );
};

export default async function Home() {
  let isAuthenticated = false;
  const userId = await handleCookies("get", "USER_ID");
  if (typeof userId === "boolean") {
    isAuthenticated = false;
    return landingPage(isAuthenticated);
  }

  const user = await getUserDocFromFirestore(userId!);
  if (typeof user === "boolean") {
    isAuthenticated = false;
    return landingPage(isAuthenticated);
  }
  const sessionStatus = await getSessionStatus();

  if (!sessionStatus) {
    isAuthenticated = false;
    return landingPage(isAuthenticated);
  } else {
    isAuthenticated = sessionStatus;
    return landingPage(isAuthenticated);
  }
}
