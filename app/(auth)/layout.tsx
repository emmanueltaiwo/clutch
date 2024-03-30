import React, { ReactNode } from "react";
import Layout from "@/components/Home/layout";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { getSessionStatus } from "@/lib/session";

const landingPage = (isAuthenticated: boolean, children: ReactNode) => {
  return (
    <section className="bg-[rgba(2,2,26)]">
      <Layout isAuthenticated={isAuthenticated}>{children}</Layout>
    </section>
  );
};

export default async function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const userId = await handleCookies("get", "USER_ID");
  if (typeof userId === "boolean") {
    return landingPage(false, children);
  }

  const user = await getUserDocFromFirestore(userId!);
  if (typeof user === "boolean") {
    return landingPage(false, children);
  }

  const isAuthenticated = await getSessionStatus();
  return landingPage(isAuthenticated, children);
}
