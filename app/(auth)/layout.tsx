import React, { ReactNode } from "react";
import Layout from "@/components/layout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <Layout>{children}</Layout>
    </section>
  );
}
