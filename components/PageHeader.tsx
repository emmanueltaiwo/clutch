"use client";

import { User } from "@/types";
import { ReactNode } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { useAppDispatch } from "@/lib/hooks";
import { openSidebar } from "@/lib/features/sidebar/sidebarSlice";

const PageHeader = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full sticky top-0 flex items-center gap-2 bg-background z-50 h-[14vh] border-b-[1px] p-5">
      <button
        onClick={() => {
          dispatch(openSidebar());
        }}
        className="flex md:hidden"
      >
        <ProfileAvatar user={user} />
      </button>

      <div className="ml-5 md:ml-0 flex items-center gap-2">{children}</div>
    </div>
  );
};

export default PageHeader;
