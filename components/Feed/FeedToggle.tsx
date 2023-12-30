"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { toggleFeedMode } from "@/lib/features/feed/feedSlice";

const FeedToggle = () => {
  const dispatch = useAppDispatch();
  const feedToggle = useAppSelector((state) => state.feed.feedMode);

  return (
    <div className="sticky top-0 w-full bg-background border-b-[0.5px] border-gray-500 h-[11vh]  flex justify-between gap-5 items-center z-50">
      <button
        onClick={() => dispatch(toggleFeedMode("forYou"))}
        className={`${
          feedToggle === "forYou"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 border-b-[3px] border-gray-500"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300"
        }`}
      >
        For you
      </button>
      <button
        onClick={() => dispatch(toggleFeedMode("following"))}
        className={`${
          feedToggle === "following"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 border-b-[3px] border-gray-500"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300"
        }`}
      >
        Following
      </button>
    </div>
  );
};

export default FeedToggle;
