"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";

const FeedToggle = () => {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  return (
    <div
      className={`${
        isOpen
          ? "sticky top-0 w-full bg-background border-b-[0.5px] border-gray-500 h-[11vh]  flex justify-between gap-5 items-center z-50"
          : "sticky top-0 w-full border-b-[0.5px] border-gray-500 h-[11vh] flex justify-between gap-5 items-center z-50"
      }`}
    >
      <button className="w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 border-b-[3px] border-gray-500">
        For you
      </button>
      <button className="w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300">
        Following
      </button>
    </div>
  );
};

export default FeedToggle;
