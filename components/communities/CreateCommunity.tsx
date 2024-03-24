"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { COMMUNITY_TYPES } from "@/constants";
import {
  createNewCommunity,
  fetchUserCreatedCommunities,
} from "@/services/communities";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Community } from "@/types";
import CommunityCard from "./CommunityCard";
import CommunityLoader from "./CommunityLoader";

const CreateCommunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["created-communities"],
    queryFn: async () => await fetchUserCreatedCommunities(),
  });
  const [filteredCommunity, setFilteredCommunity] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");

  const { mutate: mutateCreateCommunity, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const name = formData.get("name")?.toString();
      const description = formData.get("description")?.toString();
      const visibility = formData.get("visibility")?.toString();
      const type = formData.get("type")?.toString();

      if (!name || !description || !visibility || !type) {
        return toast({
          title: "Community Creation Failed",
          description: "Please fill in all fields",
        });
      }

      const response = await createNewCommunity(
        name,
        description,
        type,
        visibility
      );

      if (!response) {
        return toast({
          title: "An Error Occurred!",
          description: "Refresh page and try again",
        });
      }

      return toast({
        description: "Community Created Successfully",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["created-communities"] });
    },
  });

  useEffect(() => {
    if (Array.isArray(communities)) {
      setFilteredCommunity(communities);
    }
  }, [communities]);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto flex flex-col gap-3">
      <CommunityLoader />
    </div>
  ));

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
    setFilteredCommunity(filtered);
  };

  return (
    <section className="w-full flex flex-col gap-10">
      <Card className="min-w-full mt-5">
        <CardHeader>
          <CardTitle>Create your community</CardTitle>
          <CardDescription>
            Get your community running with one click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutateCreateCommunity(new FormData(e.target as HTMLFormElement));
            }}
          >
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="communityName">Community Name</Label>
                <Input
                  name="name"
                  id="communityName"
                  placeholder="Name of your community"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="communityDescription">
                  Community Description
                </Label>
                <Input
                  name="description"
                  id="communityDescription"
                  placeholder="Description of your community"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="communityType">Community Type</Label>
                <Select name="type">
                  <SelectTrigger id="communityType">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {COMMUNITY_TYPES.map((community) => (
                      <SelectItem key={community.id} value={community.value}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="visibility">Visibility</Label>
                <Select name="visibility">
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="mt-5" type="submit" disabled={isPending}>
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Create Community
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        skeletonCards
      ) : (
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-[20px] cursor-pointer">
            Communities you created
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="Search for community"
              value={searchTerm}
              onChange={(e) => handleSearch(e)}
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

          {filteredCommunity.length === 0 && (
            <Card className="p-5">
              <CardDescription className="text-center">
                No communities found.
              </CardDescription>
            </Card>
          )}

          {filteredCommunity.length > 0 && (
            <div className="flex flex-col gap-5">
              {filteredCommunity.map((community) => (
                <CommunityCard
                  hasJoined={true}
                  key={community.communityId}
                  community={community}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CreateCommunity;
