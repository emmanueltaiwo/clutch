import Banner from "@/components/Home/Banner";
import Contributors from "@/components/Home/Contributors";
import Features from "@/components/Home/Features";
import Layout from "@/components/Home/layout";

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col w-full h-full bg-[rgba(2,2,26)]">
        <Banner />
        <Features />
        <Contributors />
      </main>
    </Layout>
  );
}
