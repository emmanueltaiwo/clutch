import Banner from "@/components/Banner";
import Contributors from "@/components/Contributors";
import Features from "@/components/Features";
import Layout from "@/components/layout";
import { fetchAllContributors } from "@/services/github";

export default async function Home() {
  const contributors = await fetchAllContributors();

  return (
    <Layout>
      <main className="flex flex-col w-full h-full">
        <Banner />
        <Features />
        <Contributors contributors={contributors} />
      </main>
    </Layout>
  );
}
