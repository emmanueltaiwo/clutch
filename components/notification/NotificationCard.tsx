import { Notification } from "@/types";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/services/notifications";
import { useToast } from "../ui/use-toast";
import { formatDate } from "@/utils/helpers";
import { BellRing } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card
      className={`w-[95%] mx-auto flex flex-col gap-5 border-t-[1px] p-5 cursor-pointer hover:bg-[rgba(48,48,48,0.29)] ${
        !notification.hasRead && "bg-[rgba(48,48,48,0.29)] animate-pulse"
      } ${notification.hasRead && "transition-all duration-300"}`}
    >
      <div className=" flex items-center space-x-4 rounded-md border p-4">
        <BellRing />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            {notification.notificationText}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDate(notification.createdAt)}
          </p>
        </div>
      </div>
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
    </Card>
  );
};

export default NotificationCard;
