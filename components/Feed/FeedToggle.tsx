"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FeedToggle = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  console.log("feed", mode);

  return (
    <div className="sticky top-0 w-full bg-background border-b-[0.5px] border-gray-500 h-[11vh]  flex justify-between gap-5 items-center z-50">
      <Link
        href="/feed?mode=for-you"
        className={`${
          mode === "for-you" || mode === null
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 border-b-[3px] border-gray-500 flex items-center justify-center"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 flex items-center justify-center"
        }`}
      >
        For you
      </Link>
      <Link
        href="/feed?mode=following"
        className={`${
          mode === "following"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 border-b-[3px] border-gray-500 flex items-center justify-center"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] sm:text-[20px] transition-all duration-300 flex items-center justify-center"
        }`}
      >
        Following
      </Link>
    </div>
  );
};

export default FeedToggle;
