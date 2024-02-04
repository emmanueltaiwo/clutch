import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Skeleton className="w-[50px] h-[50px] rounded-full" />

        <div className="flex flex-col gap-3">
          <Skeleton className="w-[200px] h-[20px] rounded-md" />
          <Skeleton className="w-[150px] h-[20px] rounded-md" />
        </div>
      </div>

      <Skeleton className="w-full h-[20px] rounded-md" />
    </div>
  );
};

export default SkeletonCard;
