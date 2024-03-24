"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Community } from "@/types";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import CommunitySkeleton from "./CommunitySkeleton";
import { Button } from "@/components/ui/button";
import { fetchUserCommunities } from "@/services/communities";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RightPanel = () => {
  const { data, isLoading } = useQuery<Community[]>({
    queryKey: ["my-communities"],
    queryFn: async () => await fetchUserCommunities(),
  });

  const skeletonCards = Array.from({ length: 2 }, (_, index) => (
    <div key={index} className="w-full flex flex-col gap-3">
      <CommunitySkeleton />
    </div>
  ));

  return (
    <Card className="rounded-none hidden lg:inline lg:w-[25%] xl:w-[27%] top-0 bottom-0 fixed right-0 overflow-y-auto transition-all duration-500">
      <div className="mt-5 flex flex-col gap-5">
        <Card className="w-[90%] rounded-full h-[55px] mx-auto flex gap-4 items-center px-4">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search.."
            className="h-full bg-transparent outline-none dark:placeholder:text-gray-200 placeholder:text-gray-900"
          />
        </Card>

        <Card className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] overflow-y-auto p-4">
          <h1 className="text-gray-900 dark:text-gray-100 text-[20px] font-[600]">
            Active Communities
          </h1>

          <CardContent className="w-full flex flex-col items-center gap-4 mx-auto rounded-[15px] h-fit bg-gray-100 dark:bg-gray-900/50 overflow-y-auto p-3">
            <h4 className="font-[300] text-[rgb(26,32,44)] dark:text-[rgb(205,211,226)] text-[15px] text-center">
              None of your communities are currently active
            </h4>
            <Button asChild>
              <Link href="/communities">Find Community</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] h-fit max-h-[500px] overflow-y-auto p-4">
          <h1 className="text-gray-900 dark:text-gray-100 lg:text-[15px] xl:text-[20px] font-[600]">
            Recommended for you
          </h1>

          {isLoading && skeletonCards}

          {data && data.length < 1 ? (
            <Card className="flex flex-col gap-3 items-center justify-center p-5 rounded-[15px] transition-all duration-200">
              <CardTitle>No community was found</CardTitle>

              <Button asChild>
                <Link href="/communities">Create Community</Link>
              </Button>
            </Card>
          ) : (
            data?.slice(0, 10).map((community) => (
              <Button
                key={community.communityId}
                variant="outline"
                asChild
                className="w-full h-fit justify-start p-3"
              >
                <Link
                  className="w-full flex gap-4 justify-start"
                  href={`/communities/${community.communityId}`}
                >
                  <Image
                    src={
                      community.communityImage.length > 1
                        ? community.communityImage
                        : "/assets/Images/cover.png"
                    }
                    width={100}
                    height={100}
                    alt="community image"
                    className="rounded-full w-[40px] h-[40px]"
                  />
                  <div className="flex flex-col gap-1">
                    <CardTitle>{community.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap items-center">
                      <CardDescription>{community.type}</CardDescription>
                      <span>-</span>
                      <CardDescription>
                        <span> {community.members} member</span>
                      </CardDescription>
                    </div>
                  </div>
                </Link>
              </Button>
            ))
          )}
        </Card>

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
    </Card>
  );
};

export default RightPanel;
