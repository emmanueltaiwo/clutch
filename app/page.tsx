import Banner from "@/components/Banner";
import Contributors from "@/components/Contributors";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="flex flex-col w-full h-full">
      <Banner />
      <Features />
      <Contributors />
    </main>
  );
}
