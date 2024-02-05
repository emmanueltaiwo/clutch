"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const PostAvatar = ({
  profilePic,
  fullName,
}: {
  profilePic: string;
  fullName: string;
}) => {

  return (
    <Avatar>
      {profilePic.length !== 0 && (
        <Image
          src={profilePic}
          width={50}
          height={50}
          className="min-w-[50px] min-h-[50px] rounded-full invert-0 dark:invert dark:filter"
          alt="Profile Pic"
        />
      )}

      <AvatarFallback delayMs={1000}>
        {fullName
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default PostAvatar;
