"use client";

import React, { useMemo } from "react";
import { Notification } from "@/types";
import NotificationHeader from "./NotificationHeader";
import NotificationCard from "./NotificationCard";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/services/notifications";
import NotificationSkeleton from "./NotificationSkeleton";

const NotificationContainer = () => {
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => await fetchNotifications(),
  });

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto flex flex-col gap-3">
      <NotificationSkeleton />
    </div>
  ));

  const sortedNotifications = useMemo(() => {
    return (
      notifications &&
      [...notifications].sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  }, [notifications]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-7 w-full mt-10">
        <h2 className="font-bold text-[25px] cursor-pointer ml-5">
          Notifications
        </h2>
        {skeletonCards}
      </div>
    );

  if (!Array.isArray(notifications)) return skeletonCards;

  return (
    <section className="w-full mx-auto">
      <NotificationHeader notifications={notifications} />

      <div className="mt-10 flex flex-col gap-5">
        {notifications.length === 0 ? (
          <p className="text-center">
            You don&apos;t have any notification at this time
          </p>
        ) : (
          sortedNotifications?.map((notification) => (
            <NotificationCard
              key={notification.notificationId}
              notification={notification}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default NotificationContainer;
