import Banner from "@/components/home/Banner";
import Contributors from "@/components/home/Contributors";
import Features from "@/components/home/Features";
import Layout from "@/components/home/layout";

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
