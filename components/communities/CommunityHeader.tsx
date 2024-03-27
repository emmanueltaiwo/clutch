"use client";

import { Community, SearchResult } from "@/types";
import { FC } from "react";
import BackButton from "../post-details/BackButton";
import { capitalizeWord } from "@/utils/helpers";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  communityMembers: SearchResult[];
  community: Community;
};

const CommunityHeader: FC<Props> = ({ community, communityMembers }) => {
  return (
    <section className="w-full flex flex-col">
      <div className="flex items-center gap-5 h-[11vh] px-5">
        <BackButton />
        <h3 className="text-[24px] font-bold cursor-pointer">
          {capitalizeWord(community.name)}
        </h3>
      </div>

      {community.communityImage.length > 1 ? (
        <Image
          src={community.communityImage}
          width={500}
          height={200}
          alt="Banner"
          className="w-full h-[200px]"
        />
      ) : (
        <div className="w-full h-[200px] bg-gradient-to-r from-blue-700/50 to-blue-800/50 flex items-center justify-center" />
      )}

      <div className="w-full h-fit p-5 bg-[#2d2d2d37] flex justify-between gap-3">
        <div className="flex flex-col gap-3">
          <h3 className="text-[35px] font-bold">
            {capitalizeWord(community.name)}
          </h3>
          <Badge variant="outline" className="px-1 w-fit cursor-pointer">
            {community.type}
          </Badge>
          <Button variant="link" className="w-fit p-0">
            {communityMembers.length} member
          </Button>
        </div>
        <Button variant="outline" className="w-fit">
          Leave
        </Button>
      </div>
    </section>
  );
};

export default CommunityHeader;
