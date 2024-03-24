import { ChangeEvent, useState, useEffect } from "react";
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
import { findCommunitiesToJoin } from "@/services/communities";
import { useQuery } from "@tanstack/react-query";
import { Card, CardDescription } from "@/components/ui/card";
import CommunityLoader from "./CommunityLoader";
import CommunityCard from "./CommunityCard";
import { Community } from "@/types";

const FindCommunities = () => {
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["find-communities"],
    queryFn: async () => await findCommunitiesToJoin(),
  });
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");

  useEffect(() => {
    if (Array.isArray(communities)) {
      setFilteredCommunities(communities);
    }
  }, [communities]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);
    filterCommunities(search, categoryFilter, visibilityFilter);
  };

  const filterCommunities = (
    search: string,
    category: string,
    visibility: string
  ) => {
    let filtered = communities || [];
    if (search) {
      filtered = filtered.filter((community) =>
        community.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category && category !== "All") {
      filtered = filtered.filter((community) => community.type === category);
    }
    if (visibility && visibility !== "All") {
      filtered = filtered.filter(
        (community) => community.visibility === visibility
      );
    }
    setFilteredCommunities(filtered);
  };

  const loadingSkeletons = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto flex flex-col gap-3">
      <CommunityLoader />
    </div>
  ));

  const noCommunitiesFoundCard = (
    <Card className="p-5">
      <CardDescription className="text-center">
        No communities found.
      </CardDescription>
    </Card>
  );

  return (
    <section className="min-w-full mt-5 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Input
          type="text"
          placeholder="Search for community"
          value={searchTerm}
          onChange={handleSearch}
        />

        <Select
          onValueChange={(e) => {
            setCategoryFilter(e);
            filterCommunities(searchTerm, e, visibilityFilter);
          }}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              {COMMUNITY_TYPES.map((community) => (
                <SelectItem key={community.id} value={community.value}>
                  {community.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(e) => {
            setVisibilityFilter(e);
            filterCommunities(searchTerm, categoryFilter, e);
          }}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Filter by visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Visibility</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isLoading && loadingSkeletons}

      {filteredCommunities.length === 0 ? (
        noCommunitiesFoundCard
      ) : (
        <div className="flex flex-col gap-5">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.communityId} community={community} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FindCommunities;
