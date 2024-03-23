import { Notification } from "@/types";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/services/notifications";
import { useToast } from "../ui/use-toast";
import { formatDate } from "@/utils/helpers";

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutateLikePost, isPending } = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await markNotificationAsRead(notificationId);

      if (!response) {
        return toast({
          description: "Something went wrong! Refresh and try again",
        });
      }

      return toast({
        description: "Notification has been marked as read",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div
      className={`w-full flex flex-col gap-5 border-t-[1px] p-5 cursor-pointer transition-all duration-300 hover:bg-[rgba(48,48,48,0.29)] ${
        !notification.hasRead &&
        "bg-[rgba(48,48,48,0.29)] animate-pulse transition-none duration-1000"
      }`}
    >
      <div className="flex gap-10">
        <div className="min-w-[50px] h-[50px] rounded-full bg-gray-600 flex items-center justify-center">
          <Image
            src="/assets/Images/logoIcon.svg"
            width={30}
            height={30}
            alt="logo"
            className="invert dark:invert-0"
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <p>{notification.notificationText}</p>

          {notification.hasRead ? (
            <Button variant="link" disabled className="w-fit rounded-md p-0">
              Marked as read
            </Button>
          ) : (
            <Button
              disabled={isPending}
              onClick={async () => mutateLikePost(notification.notificationId)}
              className="w-fit rounded-md px-3"
            >
              Mark as read
            </Button>
          )}
        </div>

        <p className="font-[100] text-gray-800 text-[12px] dark:text-gray-400 gap-1 w-[30%] flex justify-end">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
