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

const FindCommunities = () => {
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
      </div>
      <CommunityCard />
    </section>
  );
};

export default FindCommunities;
