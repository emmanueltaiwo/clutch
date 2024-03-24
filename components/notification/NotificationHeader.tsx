"use client";

import { Notification, User } from "@/types";
import PageHeader from "../PageHeader";

const NotificationHeader = ({
  notifications,
  user,
}: {
  notifications: Notification[];
  user: User;
}) => {
  return (
    <PageHeader user={user}>
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
