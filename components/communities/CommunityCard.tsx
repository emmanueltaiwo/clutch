"use client";

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

const CommunityCard = ({
  community,
  hasJoined,
}: {
  community: Community;
  hasJoined?: boolean;
}) => {
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
        <CardContent className="w-full flex items-end gap-3">
          <div className="w-full flex flex-col space-y-1.5">
            <Label htmlFor="communityName">Enter your invite code</Label>
            <Input name="name" id="code" placeholder="Invite code" />
          </div>

          <Button className="w-[150px]">Join Community</Button>
        </CardContent>
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
          <Button asChild className="w-full">
            <Link href={`/communities/${community.communityId}`}>
              {hasJoined ? "Enter" : "Join"} Community
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommunityCard;
