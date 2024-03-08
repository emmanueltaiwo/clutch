"use client";


import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { openSidebar } from "@/lib/features/sidebar/sidebarSlice";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const FeedToggle = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const dispatch = useAppDispatch();

  return (
    <div className="sticky top-0 w-full bg-background border-b-[0.5px] border-gray-500 h-[11vh]  flex justify-between gap-5 items-center z-50">
      <button
        onClick={() => {
          dispatch(openSidebar());
        }}
        className="md:hidden ml-3 text-gray-900 dark:text-white p-1 rounded-full bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)] dark:hover:bg-[rgba(24,29,40,0.99)] transition-all duration-200"
      >
        <ChevronRightIcon />
      </button>
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
