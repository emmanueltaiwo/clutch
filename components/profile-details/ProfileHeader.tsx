"use client";

import Image from "next/image";
import { FC, useRef, useState } from "react";
import { Button } from "../ui/button";
import { capitalizeEachWord, capitalizeWord } from "@/utils/helpers";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { ReloadIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { editProfile, handleFollowUser } from "@/services/profile";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/lib/hooks";
import { openSidebar } from "@/lib/features/sidebar/sidebarSlice";

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
  isUserAlreadyFollowing: boolean;
  totalFollowers: number;
  totalFollowing: number;
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
  isUserAlreadyFollowing,
  totalFollowers,
  totalFollowing,
}) => {
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    isUserAlreadyFollowing
  );
  const [followers, setFollowers] = useState<number>(totalFollowers);
  const [user, setUser] = useState({
    profilePic: profilePic,
    fullName: fullName,
    username: username,
    country: country,
    gender: gender,
    email: email,
    bio: bio,
  });
  const dispatch = useAppDispatch();

  return (
    <section className="flex flex-col">
      <button
        onClick={() => {
          dispatch(openSidebar());
        }}
        className="absolute mt-3 md:hidden ml-3 text-gray-900 dark:text-white p-1 rounded-full bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)] dark:hover:bg-[rgba(24,29,40,0.99)] transition-all duration-200"
      >
        <ChevronRightIcon />
      </button>
      <div className="w-full h-[200px] bg-gradient-to-r from-cyan-700 to-blue-800 flex items-center justify-center" />

      <div className="absolute left-0 right-0 top-[120px] md:relative md:top-[-80px] flex justify-center">
        {user.profilePic.length !== 0 ? (
          <Image
            src={user.profilePic}
            width={2000}
            height={150}
            className="rounded-[10px] invert-0 h-[150px] w-[150px]"
            alt="Profile Pic"
          />
        ) : (
          <div className="w-[150px] h-[150px] flex items-center justify-center text-[50px] font-bold rounded-[10px] text-white bg-gray-900">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
      </div>

      <div
        className={`mt-20 md:mt-0 md:relative flex flex-col justify-center ${
          userId === defaultUserId ? "md:top-[-120px]" : "md:top-[-80px]"
        }`}
      >
        {userId === defaultUserId && (
          <div className="mx-auto md:mx-0 md:relative top-[-10px] left-[-25px] md:flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when youre
                    done.
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

                    setUser({
                      ...user,
                      fullName: newFullName,
                      username: newUsername,
                      bio: newBio,
                    });
                    return toast({
                      description: "Profile updated successfully!",
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
                        defaultValue={user.fullName}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        name="username"
                        defaultValue={user.username.toLowerCase()}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bio" className="text-right">
                        Bio
                      </Label>
                      <Textarea
                        defaultValue={user.bio}
                        name="bio"
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
          className={`flex flex-col gap-1 items-center justify-center mt-3 relative`}
        >
          <h4 className="text-gray-200 font-[600] text-[24px]">
            {capitalizeWord(user.fullName)}
          </h4>
          <p className="font-[100] text-gray-800 text-[12px] dark:text-gray-400 flex items-center gap-2">
            @{user.username.toLowerCase()} <span>||</span>{" "}
            <span className="flex items-center gap-1">
              <AddLocationAltIcon fontSize="small" />
              {capitalizeEachWord(user.country)}
            </span>
          </p>
          {user.bio.length < 1 ? (
            <p className="font-[400] text-gray-400 text-[16px] dark:text-gray-200 flex items-center gap-2">
              {capitalizeEachWord(user.gender)} ||{" "}
              <span className="flex items-center gap-1">
                <AddLocationAltIcon fontSize="small" />
                {capitalizeEachWord(user.country)}
              </span>{" "}
              || {user.email.toLowerCase()}
            </p>
          ) : (
            <p className="font-[400] text-gray-400 text-[16px] dark:text-gray-200 w-[90%] lg:w-[60%] text-center">
              {capitalizeEachWord(user.bio)}
            </p>
          )}

          <div className="flex items-center">
            <Button variant="link">
              {followers} {followers < 2 ? "Follower" : "Followers"}
            </Button>

            <Button variant="link">{totalFollowing} Following</Button>
          </div>

          {userId !== defaultUserId && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={async () => {
                const response = await handleFollowUser(userId);

                if (response === "You just followed this user") {
                  setIsFollowing(true);
                  setFollowers((prevFollowers) => prevFollowers + 1);
                } else if (response === "You Unfollowed this  user") {
                  setIsFollowing(false);
                  setFollowers((prevFollowers) => prevFollowers - 1);
                } else {
                  setIsFollowing(false);
                }
                return toast({
                  description: response,
                });
              }}
              className="mt-2"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
