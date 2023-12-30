"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionStatus } from "@/lib/session";
import Sidebar from "@/components/Sidebar";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const sessionStatus = await getSessionStatus();

        if (!sessionStatus) {
          router.push("/");
        } else {
          setIsAuthenticated(sessionStatus);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkUserStatus();
  }, [router]);

  return (
    <section>
      {!isAuthenticated && (
        <div className="w-full flex items-center justify-center fixed top-0 bottom-0">
          <LoadingAnimation />
        </div>
      )}

      {isAuthenticated && (
        <section>
          <Sidebar />
          {children}
        </section>
      )}
    </section>
  );
}
