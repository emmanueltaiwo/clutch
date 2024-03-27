"use client";

import { Community, SearchResult } from "@/types";
import { FC, useState } from "react";
import BackButton from "../post-details/BackButton";
import { capitalizeWord } from "@/utils/helpers";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { joinPublicCommunity, leaveCommunity } from "@/services/communities";

type Props = {
  communityMembers: SearchResult[];
  community: Community;
  userId: string;
};

const CommunityHeader: FC<Props> = ({
  community,
  communityMembers,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const isMember = communityMembers.some((member) => member.userId === userId);

  const handleLeaveCommunity = async () => {
    setIsLoading(true);
    const response = await leaveCommunity(
      community.communityId,
      community.name,
      community.creator
    );

    if (!response) {
      return toast({
        description: "An error occurred! Refresh the page",
      });
    }
    setIsLoading(false);
    toast({
      description: `You just left ${community.name} community`,
    });

    router.push(`/communities`);
  };

  const handleJoinCommunity = async () => {
    setIsLoading(true);
    const response = await joinPublicCommunity(
      community.communityId,
      community.name,
      community.creator
    );

    if (!response) {
      return toast({
        description: "An error occurred! Refresh the page",
      });
    }
    setIsLoading(false);
    toast({
      title: `You just joined ${community.name} community`,
      description: "Redirecting you to the community",
    });

    router.push(`/communities/${community.communityId}`);
  };

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

        {isMember ? (
          <Button
            disabled={isLoading}
            variant="outline"
            className="w-fit"
            onClick={handleLeaveCommunity}
          >
            Leave
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            className="w-fit"
            onClick={handleJoinCommunity}
          >
            Join
          </Button>
        )}
      </div>
    </section>
  );
};

export default CommunityHeader;
