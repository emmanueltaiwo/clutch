"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";

const ProfileAvatar = () => {
  const user = useAppSelector((state) => state.auth);

  return (
    <Avatar>
      <Image
        src={user.profilePic || "/assets/Images/cover.png"}
        width={50}
        height={50}
        className="rounded-full"
        alt="Profile Pic"
      />

      <AvatarFallback delayMs={1000}>
        {user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
