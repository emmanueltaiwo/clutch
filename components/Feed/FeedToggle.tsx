"use client";

import React, { useState } from "react";

const FeedToggle = () => {
  const [feedMode, setFeedMode] = useState<"forYou" | "following">("forYou");

  const toggleForYou = () => {
    try {
      setFeedMode("forYou");
      localStorage.setItem("feed-mode", feedMode);
    } catch (error) {
      throw new Error();
    }
  };

  const toggleFollowing = () => {
    try {
      setFeedMode("following");
      localStorage.setItem("feed-mode", feedMode);
    } catch (error) {
      throw new Error();
    }
  };

  return (
    <div className="sticky top-0 w-full bg-background border-b-[0.5px] border-gray-500 h-[11vh]  flex justify-between gap-5 items-center z-50">
      <button
        onClick={toggleForYou}
        className={`${
          feedMode === "forYou"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 border-b-[3px] border-gray-500"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300"
        }`}
      >
        For you
      </button>
      <button
        onClick={toggleFollowing}
        className={`${
          feedMode === "following"
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
