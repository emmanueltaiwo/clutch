"use client";

import Image from "next/image";
import { FC, useRef } from "react";
import { Button } from "../ui/button";
import { capitalizeEachWord } from "@/utils/helpers";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { editProfile } from "@/services/profile";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  profilePic: string;
  fullName: string;
  username: string;
  country: string;
  gender: string;
  email: string;
  userId: string;
  defaultUserId: string;
  bio: string;
};

const Submit = () => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return <Button type="submit">Save Changes</Button>;
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
  bio,
}) => {
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);

  return (
    <section className="flex flex-col">
      <div className="w-full h-[200px] bg-gradient-to-r from-cyan-700 to-blue-800 flex items-center justify-center" />

      <div className="relative top-[-80px] flex justify-center">
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

      {userId === defaultUserId && (
        <div className="hidden relative top-[-140px] left-[-25px] md:flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when youre done.
                </DialogDescription>
              </DialogHeader>
              <form
                ref={ref}
                action={async (formData: FormData) => {
                  const newFullName = formData.get("fullName")?.toString();
                  const newUsername = formData.get("username")?.toString();
                  const newBio = formData.get("bio")?.toString();

                  if (!newFullName || !newUsername || !newBio) {
                    return toast({
                      description: "Form fields cannot be empty",
                    });
                  }

                  const response = await editProfile(
                    newFullName,
                    newUsername,
                    newBio
                  );

                  if (typeof response === "string") {
                    return toast({
                      description: response,
                    });
                  }

                  ref.current?.reset();
                  return toast({
                    description:
                      "Profile updated successfully! Refresh to see changes",
                  });
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      name="fullName"
                      defaultValue={fullName}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      name="username"
                      defaultValue={username.toLowerCase()}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">
                      Bio
                    </Label>
                    <Input
                      name="bio"
                      defaultValue={bio}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Submit />
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div
        className={`flex flex-col gap-1 items-center justify-center relative ${
          userId === defaultUserId ? "top-[-110px]" : "top-[-70px]"
        }`}
      >
        <h4 className="text-gray-200 font-[600] text-[24px]">{fullName}</h4>
        <p className="font-[100] text-gray-800 text-[12px] dark:text-gray-400 flex items-center gap-2">
          @{username.toLowerCase()} <span>||</span>{" "}
          <span className="flex items-center gap-1">
            <AddLocationAltIcon fontSize="small" />
            {capitalizeEachWord(country)}
          </span>
        </p>
        {bio.length < 1 ? (
          <p className="font-[400] text-gray-400 text-[16px] dark:text-gray-200 flex items-center gap-2">
            {capitalizeEachWord(gender)} ||{" "}
            <span className="flex items-center gap-1">
              <AddLocationAltIcon fontSize="small" />
              {capitalizeEachWord(country)}
            </span>{" "}
            || {email.toLowerCase()}
          </p>
        ) : (
          <p className="font-[400] text-gray-400 text-[16px] dark:text-gray-200">
            {capitalizeEachWord(bio)}
          </p>
        )}

        {userId !== defaultUserId && <Button className="mt-2">Follow</Button>}
      </div>
    </section>
  );
};

export default ProfileHeader;
