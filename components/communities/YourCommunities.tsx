"use client";

import CommunityCard from "./CommunityCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMUNITY_TYPES } from "@/constants";
import { fetchUserCommunities } from "@/services/communities";
import { Community } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Card, CardDescription } from "@/components/ui/card";
import CommunityLoader from "./CommunityLoader";

const YourCommunities = () => {
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["my-communities"],
    queryFn: async () => await fetchUserCommunities(),
  });

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto flex flex-col gap-3">
      <CommunityLoader />
    </div>
  ));

  return (
    <section className="min-w-full mt-5 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Input type="text" placeholder="Search for community" />

        <Select>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {COMMUNITY_TYPES.map((community) => (
                <SelectItem key={community.id} value={community.value}>
                  {community.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Filter by visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Visibility</SelectLabel>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isLoading && skeletonCards}

      {communities && communities.length === 0 && (
        <Card className="p-5">
          <CardDescription className="text-center">
            You have not joined any community
          </CardDescription>
        </Card>
      )}

      {communities && communities.length >= 1 && (
        <div className="flex flex-col gap-5">
          {communities?.map((community) => (
            <CommunityCard
              key={community.communityId}
              hasJoined={true}
              community={community}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default YourCommunities;
