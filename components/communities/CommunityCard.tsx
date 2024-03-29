"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Community } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trimWord } from "@/utils/helpers";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";
import {
  joinPrivateCommunity,
  joinPublicCommunity,
} from "@/services/communities";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const JoinPrivateCommunityButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="w-[150px]">
      Join Community
    </Button>
  );
};

const CommunityCard = ({
  community,
  hasJoined,
}: {
  community: Community;
  hasJoined?: boolean;
}) => {
  const [publicButtonIsLoading, setPublicButtonIsLoading] =
    useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Card className="hover:bg-[rgba(48,48,48,0.15)] transition-all duration-300 cursor-pointer">
      <CardHeader>
        <div className="flex gap-3 items-center">
          <CardTitle>{community.name}</CardTitle>

          {community.active && (
            <DotFilledIcon className="w-8 h-8 text-green-500 animate-pulse" />
          )}

          {!community.active && (
            <DotFilledIcon className="w-8 h-8 text-gray-500" />
          )}
        </div>

        <CardDescription>{trimWord(community.description)}</CardDescription>
        {community.visibility !== "private" && (
          <CardDescription>
            {community.members} {community.members > 1 ? "members" : "member"}
          </CardDescription>
        )}
      </CardHeader>

      {community.visibility === "private" && !hasJoined && (
        <form
          action={async (formData) => {
            const inviteCode = formData.get("inviteCode")?.toString();

            if (!inviteCode) {
              return toast({
                description: "Invite code cannot be empty",
              });
            }

            const response = await joinPrivateCommunity(
              community.communityId,
              community.name,
              community.creator,
              inviteCode
            );

            if (
              response !==
              `You've sucessfully joined ${community.name} community`
            ) {
              return toast({
                title: "An Error Occurred!",
                description: response,
              });
            }

            toast({
              title: `You just joined ${community.name} community`,
              description: "Redirecting you to the community",
            });

            router.push(`/communities/${community.communityId}`);
          }}
        >
          <CardContent className="w-full flex items-end gap-3">
            <div className="w-full flex flex-col space-y-1.5">
              <Label htmlFor="inviteCode">Enter your invite code</Label>
              <Input
                name="inviteCode"
                id="inviteCode"
                placeholder="Invite code"
              />
            </div>

            <JoinPrivateCommunityButton />
          </CardContent>
        </form>
      )}

      {hasJoined && (
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/communities/${community.communityId}`}>
              Enter Community
            </Link>
          </Button>
        </CardFooter>
      )}

      {community.visibility !== "private" && !hasJoined && (
        <CardFooter>
          <Button
            disabled={publicButtonIsLoading}
            onClick={async () => {
              setPublicButtonIsLoading(true);
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

              setPublicButtonIsLoading(false);
              toast({
                title: `You just joined ${community.name} community`,
                description: "Redirecting you to the community",
              });

              router.push(`/communities/${community.communityId}`);
            }}
            className="w-full"
          >
            Join Community
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommunityCard;
