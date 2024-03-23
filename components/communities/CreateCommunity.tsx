"use client";

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
} from "@/components/ui/select";
import { COMMUNITY_TYPES } from "@/constants";
import {
  createNewCommunity,
  fetchUserCreatedCommunities,
} from "@/services/communities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Community } from "@/types";
import CommunityCard from "./CommunityCard";

const CreateCommunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["created-communities"],
    queryFn: async () => await fetchUserCreatedCommunities(),
  });
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
          title: "An Error Occured!",
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
            action={(formData: FormData) => mutateCreateCommunity(formData)}
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

      {isLoading && <p>Loading...</p>}

      {communities && communities.length === 0 && (
        <Card className="p-5">
          <CardDescription className="text-center">
            You have not created any community
          </CardDescription>
        </Card>
      )}

      {communities && communities.length >= 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-[20px] cursor-pointer">
            Communities you created
          </h2>

          <div className="flex flex-col gap-5">
            {communities?.map((community) => (
              <CommunityCard
                hasJoined={true}
                key={community.communityId}
                community={community}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateCommunity;
