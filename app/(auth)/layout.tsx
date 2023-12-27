import React, { ReactNode } from "react";
import Layout from "@/components/home/layout";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <section className="bg-[rgba(2,2,26)]">
      <Layout>{children}</Layout>
    </section>
  );
}
