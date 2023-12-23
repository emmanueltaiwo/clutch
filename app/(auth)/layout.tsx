import React, { ReactNode } from "react";
import Layout from "@/components/home/layout";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <section>
      <Layout>{children}</Layout>
    </section>
  );
}
