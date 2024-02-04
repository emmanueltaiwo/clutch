"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/lib/hooks";

const Container = ({ children }: { children: ReactNode }) => {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  return (
    <main
      className={`${
        isOpen
          ? "hidden sm:inline sm:ml-[37%] md:ml-[33%] lg:ml-[25%] xl:ml-[21%] sm:w-[63%] md:w-[67%] lg:w-[50%] transition-all duration-500 xl:w-[52%] z-50"
          : "ml-[20%] sm:ml-[10%] md:ml-[9%] lg:ml-[8%] xl:ml-[5%] w-[80%] sm:w-[90%] md:w-[91%] lg:w-[67%] transition-all duration-500 xl:w-[68%] z-50"
      }`}
    >
      {children}
    </main>
  );
};

export default Container;
