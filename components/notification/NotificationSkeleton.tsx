import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Skeleton className="w-[50px] h-[50px] rounded-full" />

        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="w-full h-[20px] rounded-md" />
          <Skeleton className="w-[100px] h-[36px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
