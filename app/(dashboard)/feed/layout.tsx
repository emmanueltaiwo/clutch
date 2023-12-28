import RightPanel from "@/components/RightPanel";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex justify-between">
      {children}
      <RightPanel />
    </section>
  );
}
