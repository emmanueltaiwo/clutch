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
  let isAuthenticated = false;
  const userId = await handleCookies("get", "USER_ID");
  if (typeof userId === "boolean") {
    isAuthenticated = false;
    return landingPage(isAuthenticated, children);
  }

  const user = await getUserDocFromFirestore(userId!);
  if (typeof user === "boolean") {
    isAuthenticated = false;
    return landingPage(isAuthenticated, children);
  }
  const sessionStatus = await getSessionStatus();

  if (!sessionStatus) {
    isAuthenticated = false;
    return landingPage(isAuthenticated, children);
  } else {
    isAuthenticated = sessionStatus;
    return landingPage(isAuthenticated, children);
  }
}
