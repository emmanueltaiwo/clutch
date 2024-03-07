"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { recommendCommunityToUser } from "@/services/communities";
import { Community } from "@/types/communities-types";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import CommunitySkeleton from "./CommunitySkeleton";
import { Button } from "@/components/ui/button";

const RightPanel = () => {
  const { data, isLoading } = useQuery<Community[]>({
    queryKey: ["communities"],
    queryFn: async () => await recommendCommunityToUser(),
    staleTime: 0,
  });

  const skeletonCards = Array.from({ length: 2 }, (_, index) => (
    <div key={index} className="w-full flex flex-col gap-3">
      <CommunitySkeleton />
    </div>
  ));

  return (
    <section className="hidden lg:inline lg:w-[25%] xl:w-[27%] bg-gray-100 dark:bg-gray-900 top-0 bottom-0 fixed right-0 overflow-y-auto transition-all duration-500">
      <div className="mt-5 flex flex-col gap-5">
        <div className="w-[90%] focus-within:border-2 border-gray-500 rounded-full h-[60px] mx-auto flex gap-4 items-center px-4 bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)]">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search.."
            className="h-full bg-transparent outline-none dark:placeholder:text-gray-200 placeholder:text-gray-900"
          />
        </div>

        <div className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] h-fit bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)] overflow-y-auto p-2">
          <h1 className="text-gray-900 dark:text-gray-100 text-[20px] font-[600]">
            Active Communities
          </h1>

          <div className="w-full flex flex-col items-center gap-4 mx-auto rounded-[15px] h-fit bg-gray-100 dark:bg-[rgb(26,32,44)] overflow-y-auto p-3">
            <h4 className="font-[300] text-[rgb(26,32,44)] dark:text-[rgb(205,211,226)] text-[15px] text-center">
              None of your communities are currently active
            </h4>
            <Button asChild>
              <Link href="/communities">Find Community</Link>
            </Button>
          </div>
        </div>

        <div className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] h-fit max-h-[500px] bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)] overflow-y-auto p-2">
          <h1 className="text-gray-900 dark:text-gray-100 lg:text-[15px] xl:text-[20px] font-[600]">
            Recommended for you
          </h1>

          {isLoading && skeletonCards}

          {data && data.length < 1 ? (
            <div className="flex flex-col gap-3 items-center justify-center px-2 py-3 rounded-[15px] transition-all duration-200 bg-gray-100 dark:bg-[rgba(38,47,66,0.86)]">
              <h3 className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5">
                No community was found
              </h3>

              <Button asChild>
                <Link href="/communities/create">Create Community</Link>
              </Button>
            </div>
          ) : (
            data?.slice(0, 10).map((community) => (
              <Link
                key={community.communityID}
                href={`communities/${community.communityCategory}/${community.communityID}`}
                className="w-full flex items-center gap-2 mx-auto transition-all duration-300 hover:bg-[rgba(0,0,0,0.18)] p-2 rounded-[15px]"
              >
                <Image
                  src={community.communityPic ?? "/assets/Images/cover.png"}
                  width={100}
                  height={100}
                  alt="community image"
                  className="rounded-full w-[40px] h-[40px]"
                />
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-[rgb(26,32,44)] dark:text-[rgb(205,211,226)] text-[15px] text-center">
                    {community.communityName}
                  </h4>
                  <div className="flex gap-1 flex-wrap items-center">
                    <p className="text-[13px] font-[200] text-gray-700 dark:text-gray-300 italic">
                      {community.communityCategory}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-[90%] flex flex-wrap gap-3 mx-auto py-5">
          <a
            href="https://github.com/realemmanuel/clutch"
            className="font-bold text-[12px] text-gray-900 dark:text-gray-400"
          >
            Report a Problem
          </a>
          <a
            href="https://github.com/realemmanuel/clutch"
            className="font-bold text-[12px] text-gray-900 dark:text-gray-400"
          >
            Contribute
          </a>
          <a
            href="https://github.com/realemmanuel/clutch"
            className="font-bold text-[12px] text-gray-900 dark:text-gray-400"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </section>
  );
};

export default RightPanel;
