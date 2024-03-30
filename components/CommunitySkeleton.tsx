import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CommunitySkeleton = () => {
  return (
    <div className="w-full flex items-center gap-5 mt-4">
      <Skeleton className="w-[50px] h-[50px] rounded-full" />
      <Skeleton className="w-[70%] h-[20px] rounded-md" />
    </div>
  );
};

export default CommunitySkeleton;
