"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { User } from "@/types";

const ProfileAvatar = (user: { user: User }) => {
  return (
    <Avatar>
      {user.user.profilePic.length !== 0 && (
        <Image
          src={user.user.profilePic}
          width={50}
          height={50}
          className="min-w-[50px] min-h-[50px] rounded-full invert-0 dark:invert dark:filter"
          alt="Profile Pic"
        />
      )}

      <AvatarFallback delayMs={1000}>
        {user.user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
