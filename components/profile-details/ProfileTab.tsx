"use client";

import { FC } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFeedMode } from "@/lib/features/profileFeedMode/profileFeedModeSlice";

type Props = {
  userId: string;
};

const ProfileTab: FC<Props> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const profileFeedMode = useAppSelector(
    (state) => state.profileFeedMode.profileFeedMode
  );

  return (
    <section className="dark:bg-background sticky top-0 w-full flex justify-between gap-2 h-[11vh] z-50">
      <button
        onClick={() => dispatch(setFeedMode("posts"))}
        className={`${
          profileFeedMode === "posts"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] transition-all duration-300 border-b-[3px] border-gray-500"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] transition-all duration-300"
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => dispatch(setFeedMode("likes"))}
        className={`${
          profileFeedMode === "likes"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px]  transition-all duration-300 border-b-[3px] border-gray-500"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px]] transition-all duration-300"
        }`}
      >
        Favourites
      </button>
      <button
        onClick={() => dispatch(setFeedMode("comments"))}
        className={`${
          profileFeedMode === "comments"
            ? "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] transition-all duration-300 border-b-[3px] border-gray-500"
            : "w-full h-full text-gray-900 hover:bg-[rgba(48,48,48,0.29)] dark:text-gray-200 text-[15px] transition-all duration-300"
        }`}
      >
        Replies
      </button>
    </section>
  );
};

export default ProfileTab;
