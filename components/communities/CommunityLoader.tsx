import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CommunityLoader = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <Skeleton className="w-[200px] h-[20px] rounded-md" />

      <Skeleton className="w-full h-[60px] rounded-md" />
    </div>
  );
};

export default CommunityLoader;
