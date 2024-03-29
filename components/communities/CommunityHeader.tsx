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
import {
  joinPublicCommunity,
  leaveCommunity,
  fetchAllCommunityMembers,
  deleteCommunity,
} from "@/services/communities";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  community: Community;
  userId: string;
};

const CommunityHeader: FC<Props> = ({ community, userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: communityMembers, isLoading: communityMembersLoading } =
    useQuery<SearchResult[]>({
      queryKey: ["community-members", community.communityId],
      queryFn: async () =>
        await fetchAllCommunityMembers(community.communityId),
    });

  const isMember = communityMembers?.some((member) => member.userId === userId);

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
        <Image
          src="/assets/Images/community.png"
          width={500}
          height={200}
          alt="Banner"
          className="w-full h-[150px]"
        />
      )}

      <div className="w-full h-fit p-5 bg-[#2d2d2d37] flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col gap-3">
          <h3 className="text-[35px] font-bold">
            {capitalizeWord(community.name)}
          </h3>
          <p className="text-[13px] w-full font-[300]">
            {community.description}
          </p>
          <Badge variant="outline" className="px-1 w-fit cursor-pointer">
            {community.type}
          </Badge>
          {communityMembersLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Button variant="link" className="w-fit p-0">
              {communityMembers?.length}{" "}
              {communityMembers && communityMembers.length > 1
                ? "members"
                : "member"}
            </Button>
          )}
        </div>

        {isMember &&
          community.creator !== userId &&
          !communityMembersLoading && (
            <Button
              disabled={isLoading}
              variant="outline"
              className="w-fit"
              onClick={handleLeaveCommunity}
            >
              Leave
            </Button>
          )}

        {!isMember && !communityMembersLoading && (
          <Button
            disabled={isLoading}
            className="w-fit"
            onClick={handleJoinCommunity}
          >
            Join
          </Button>
        )}

        {community.creator == userId && (
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" className="w-fit">
                Delete Community
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    const response = await deleteCommunity(
                      community.communityId
                    );

                    if (!response) {
                      setIsLoading(false);
                      return toast({
                        description: "An error occurred! Refresh the page",
                      });
                    }

                    setIsLoading(false);
                    toast({
                      description: `You just deleted ${community.name} community`,
                    });

                    router.push(`/communities`);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </section>
  );
};

export default CommunityHeader;
