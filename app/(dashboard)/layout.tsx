"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionStatus } from "@/lib/session";

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
        <p className="text-white text-[15px] font-medium text-center">
          Loading...
        </p>
      )}

      {isAuthenticated && <>{children}</>}
    </section>
  );
}
