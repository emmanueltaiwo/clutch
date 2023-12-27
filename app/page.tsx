import Banner from "@/components/home/Banner";
import Contributors from "@/components/home/Contributors";
import Features from "@/components/home/Features";
import Layout from "@/components/home/layout";
import { fetchAllContributors } from "@/services/github";

export default async function Home() {
  const contributors = await fetchAllContributors();

  return (
    <Layout>
      <main className="flex flex-col w-full h-full bg-[rgba(2,2,26)]">
        <Banner />
        <Features />
        <Contributors contributors={contributors} />
      </main>
    </Layout>
  );
}
