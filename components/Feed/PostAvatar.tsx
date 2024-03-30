"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const PostAvatar = ({
  profilePic,
  fullName,
  width,
  height,
}: {
  profilePic: string;
  fullName: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Avatar>
      {profilePic.length !== 0 && (
        <Image
          src={profilePic}
          width={width ?? 50}
          height={height ?? 50}
          className="rounded-full invert-0"
          alt="Profile Pic"
        />
      )}

      <AvatarFallback>
        {fullName
          .toUpperCase()
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default PostAvatar;
