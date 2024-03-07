"use client";

import Image from "next/image";
import { FC } from "react";
import { Button } from "../ui/button";

type Props = {
  profilePic: string;
  fullName: string;
  username: string;
  country: string;
  gender: string;
  email: string;
  userId: string;
  defaultUserId: string;
};

const ProfileHeader: FC<Props> = ({
  profilePic,
  fullName,
  username,
  country,
  gender,
  email,
  userId,
  defaultUserId,
}) => {
  return (
    <section className="">
      <div className="w-full h-[200px] bg-gray-800 flex items-center justify-center">
        <h1 className="text-[30px] lg:text-[50px] font-[800] text-gray-400 mb-20">
          {fullName.toUpperCase()}
        </h1>
      </div>

      <div className="relative top-[-75px] flex justify-center">
        {profilePic.length !== 0 ? (
          <Image
            src={profilePic}
            width={2000}
            height={150}
            className="rounded-[10px] invert-0 h-[150px] w-[150px]"
            alt="Profile Pic"
          />
        ) : (
          <div className="w-[150px] h-[150px] flex items-center justify-center text-[50px] font-bold rounded-[10px] text-white bg-gray-900">
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 items-center justify-center relative top-[-50px]">
        <h4 className="text-gray-200 font-[600] text-[24px]">{fullName}</h4>
        <p className="font-[100] text-gray-800 text-[12px] dark:text-gray-400">
          @{username.toLowerCase()}
        </p>
        <p className="font-[400] text-gray-400 text-[16px] dark:text-gray-200">
          {gender.toUpperCase()} || LOCATED AT {country.toUpperCase()} ||{" "}
          {email.toUpperCase()}
        </p>

        {userId !== defaultUserId && <Button className="mt-2">Follow</Button>}
      </div>
    </section>
  );
};

export default ProfileHeader;
