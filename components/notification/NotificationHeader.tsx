"use client";

import { Notification } from "@/types";

const NotificationHeader = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  return (
    <div className="w-full flex items-center gap-2 mt-5 p-5">
      <h2 className="font-bold text-[25px] cursor-pointer">Notifications</h2>
      <span className="font-[300] text-[17px]">({notifications.length})</span>
    </div>
  );
};

export default NotificationHeader;
