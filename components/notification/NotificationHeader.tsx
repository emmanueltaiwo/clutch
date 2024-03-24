"use client";

import { Notification } from "@/types";
import PageHeader from "../PageHeader";

const NotificationHeader = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  return (
    <PageHeader>
      <h2 className="font-bold text-[25px] cursor-pointer">Notifications</h2>
      <span className="font-[300] text-[17px]">
        Unread (
        {
          notifications.filter((notification) => notification.hasRead === false)
            .length
        }
        )
      </span>
    </PageHeader>
  );
};

export default NotificationHeader;
