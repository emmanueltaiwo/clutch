"use client";

import React from "react";
import { fetchAllContributors } from "@/services/github";
import { GitHubUser } from "../../types/homepage-types";
import { BackgroundIllustrations } from "./Banner";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const Contributors = () => {
  const { data, isLoading, isError, error } = useQuery<GitHubUser[]>({
    queryKey: ["contributors"],
    queryFn: async () => await fetchAllContributors(),
  });

  console.log(data)

  if (isLoading) {
    return (
      <p className="text-white text-center font-medium text-[15px]">
        Loading contributors...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center font-medium text-[15px]">
        Error: {error.message}
      </p>
    );
  }

  return (
    <section
      id="contributors"
      className="w-full h-full flex flex-col gap-5 items-center py-10"
    >
      <BackgroundIllustrations />
      <span className="border-[#903AFF] border-2 mx-auto rounded-[50px] px-8 py-2 w-fit h-fit text-white">
        Contributors
      </span>
      <h1 className="text-[25px] xl:px-0 px-5 sm:text-[50px] md:text-[60px] lg:text-[80px] xl:text-[70px] mt-5 font-black text-white text-center lg:leading-[90px] xl:w-[1300px] mx-auto">
        Join the <span className="text-[#D434FE]">Amazing</span> individuals
        contributing to <span className="text-[#FE34B9]">Clutch</span>
      </h1>

      <ul className="flex flex-wrap gap-5">
        {data
          ?.sort((a, b) => b.contributions - a.contributions)
          .map((contributor) => (
            <Link
              href={contributor.html_url || "/"}
              target="_blank"
              className="flex flex-col justify-center items-center gap-2 bg-[rgb(11,11,41)] rounded-[10px] p-5 w-fit h-fit shadow-sm shadow-gray-600"
              key={contributor.id}
            >
              <Image
                src={contributor.avatar_url}
                width={50}
                height={50}
                alt={contributor.login}
                className="rounded-full"
              />
              <h2 className="text-white font-[500] text-[15px]">
                {contributor.login}
              </h2>
            </Link>
          ))}
      </ul>
    </section>
  );
};
export default Contributors;
