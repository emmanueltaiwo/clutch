import { ReactNode } from "react";
import { getSessionStatus } from "@/lib/session";
import Sidebar from "@/components/Sidebar";
import LoadingAnimation from "@/components/LoadingAnimation";
import { Toaster } from "@/components/ui/toaster";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  let isAuthenticated = false;
  const userId = await handleCookies("get", "USER_ID");
  if (typeof userId === "boolean") return;

  const user = await getUserDocFromFirestore(userId);
  if (typeof user === "boolean") return;
  const sessionStatus = await getSessionStatus();

  if (!sessionStatus) {
    redirect("/");
  } else {
    isAuthenticated = sessionStatus;
  }

  return (
    <section>
      {!isAuthenticated && (
        <div className="w-full flex items-center justify-center fixed top-0 bottom-0">
          <LoadingAnimation />
        </div>
      )}

      {isAuthenticated && (
        <section>
          <Sidebar username={user.username} />
          {children}
          <Toaster />
        </section>
      )}
    </section>
  );
}
