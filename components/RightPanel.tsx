"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Community, SearchResult } from "@/types";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import CommunitySkeleton from "./CommunitySkeleton";
import { Button } from "@/components/ui/button";
import {
  fetchActiveCommunities,
  joinPrivateCommunity,
} from "@/services/communities";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { recommendCommunitiesToUser } from "@/services/recommendation";
import { findUser } from "@/services/search";
import { Loader2 } from "lucide-react";
import PostAvatar from "./Feed/PostAvatar";
import { capitalizeWord } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { JoinPrivateCommunityButton } from "./communities/CommunityCard";

const RightPanel = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: activeCommunities, isLoading: activeCommunitiesLoading } =
    useQuery<Community[]>({
      queryKey: ["active-communities"],
      queryFn: async () => await fetchActiveCommunities(),
    });

  const {
    data: searchResult,
    refetch: searchRefetch,
    isLoading: searchResultLoading,
  } = useQuery<SearchResult[]>({
    queryKey: ["search-result", searchQuery.trim()],
    queryFn: async () => await findUser(searchQuery),
    enabled: false,
  });

  const { data, isLoading } = useQuery<Community[]>({
    queryKey: ["recommended-communities"],
    queryFn: async () => await recommendCommunitiesToUser(),
  });

  useEffect(() => {
    searchRefetch();
  }, [searchQuery, searchRefetch]);

  const sortedCommunities = useMemo(() => {
    return (
      data &&
      [...data].sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  }, [data]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
  };

  const skeletonCards = Array.from({ length: 2 }, (_, index) => (
    <div key={index} className="w-full flex flex-col gap-3">
      <CommunitySkeleton />
    </div>
  ));

  return (
    <Card className="rounded-none hidden lg:inline lg:w-[30%] xl:w-[27%] top-0 bottom-0 fixed right-0 overflow-y-auto transition-all duration-500 border-t-0 border-r-0 border-b-0">
      <div className="mt-5 flex flex-col gap-5">
        <Card
          className={`w-[90%] mx-auto h-[55px] flex gap-4 items-center px-4 rounded-full ${
            searchQuery.length !== 0 && "rounded-md"
          }   `}
        >
          <SearchIcon />
          <input
            value={searchQuery}
            onChange={handleSearch}
            type="search"
            placeholder="Search.."
            className="h-full w-full bg-transparent outline-none dark:placeholder:text-gray-200 placeholder:text-gray-900"
          />
        </Card>

        {searchResultLoading && searchQuery.length > 0 && (
          <Card className="w-[90%] mx-auto left-0 right-0 mt-14 rounded-md absolute flex flex-col gap-3 p-3 items-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </Card>
        )}

        {!searchResultLoading && searchQuery.length !== 0 && (
          <Card className="w-[90%] mx-auto left-0 right-0 mt-14 max-h-[515px] z-50 overflow-y-auto rounded-md absolute flex flex-col gap-3 p-3">
            {searchResult && searchResult.length === 0 && (
              <p className="text-center">
                No user matched &quot;{searchQuery}&quot;
              </p>
            )}

            {searchResult?.length !== 0 && (
              <h4 className="font-bold">{searchResult?.length} user found</h4>
            )}

            {searchResult?.map((result) => (
              <Button
                key={result.username}
                variant="outline"
                asChild
                className="w-full rounded-md h-fit justify-start px-3 py-[0.5rem]"
              >
                <Link
                  className="w-full flex gap-4 justify-start items-center"
                  href={`/profile/${result.username}`}
                >
                  <PostAvatar
                    profilePic={result.profilePic}
                    fullName={result.fullName}
                  />
                  <div className="flex flex-col">
                    <h2 className="text-[14px]">
                      {capitalizeWord(result.fullName)}
                    </h2>
                    <CardDescription>{result.username}</CardDescription>
                  </div>
                </Link>
              </Button>
            ))}
          </Card>
        )}

        <Card className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] max-h-[300px] overflow-y-auto p-4">
          <h1 className="text-gray-900 dark:text-gray-100 text-[18px] font-[900]">
            Active Communities
          </h1>

          {activeCommunitiesLoading && skeletonCards}

          <CardContent className="w-full flex flex-col items-center gap-4 mx-auto rounded-[15px] h-fit bg-gray-100 dark:bg-gray-900/50 overflow-y-auto py-3 px-2">
            {activeCommunities && activeCommunities.length < 1 ? (
              <div className="flex flex-col gap-3 items-center justify-center p-5 rounded-[15px] transition-all duration-200">
                <CardTitle>No community was found</CardTitle>

                <Button asChild>
                  <Link href="/communities">Create Community</Link>
                </Button>
              </div>
            ) : (
              activeCommunities?.slice(0, 10).map((community) => (
                <Button
                  key={community.communityId}
                  variant="outline"
                  asChild
                  className="w-full rounded-[15px] h-fit justify-start px-3 py-[0.5rem]"
                >
                  <Link
                    className="w-full flex gap-4 justify-start"
                    href={`/communities/${community.communityId}`}
                  >
                    <Image
                      src={
                        community.communityImage.length > 1
                          ? community.communityImage
                          : "/assets/Images/cover.png"
                      }
                      width={100}
                      height={100}
                      alt="community image"
                      className="rounded-full w-[40px] h-[40px]"
                    />
                    <div className="flex flex-col">
                      <div className="flex gap-3 items-center">
                        <CardTitle>{community.name}</CardTitle>

                        {community.active && (
                          <DotFilledIcon className="w-8 h-8 text-green-500 animate-pulse" />
                        )}
                      </div>

                      <CardDescription>{community.type}</CardDescription>
                    </div>
                  </Link>
                </Button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] h-fit max-h-[300px] overflow-y-auto p-4">
          <h1 className="text-gray-900 dark:text-gray-100 lg:text-[15px] xl:text-[18px] font-[900]">
            Recommended for you
          </h1>

          {isLoading && skeletonCards}

          {sortedCommunities && sortedCommunities.length < 1 ? (
            <Card className="flex flex-col gap-3 items-center justify-center p-5 rounded-[15px] transition-all duration-200">
              <CardTitle>No community was found</CardTitle>

              <Button asChild>
                <Link href="/communities">Create Community</Link>
              </Button>
            </Card>
          ) : (
            <CardContent className="w-full flex flex-col items-center gap-4 mx-auto rounded-[15px] h-fit bg-gray-100 dark:bg-gray-900/50 overflow-y-auto py-3 px-2">
              {sortedCommunities?.slice(0, 10).map((community) => (
                <div key={community.communityId} className="w-full h-fit">
                  {community.visibility === "private" ? (
                    <div className="w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full rounded-[15px] disabled:cursor-not-allowed h-fit justify-start px-3 py-[0.5rem]"
                          >
                            <Image
                              src={
                                community.communityImage.length > 1
                                  ? community.communityImage
                                  : "/assets/Images/cover.png"
                              }
                              width={100}
                              height={100}
                              alt="community image"
                              className="rounded-full w-[40px] h-[40px]"
                            />
                            <div className="flex flex-col">
                              <div className="flex gap-3 items-center">
                                <CardTitle>{community.name}</CardTitle>

                                {community.active && (
                                  <DotFilledIcon className="w-8 h-8 text-green-500 animate-pulse" />
                                )}

                                {!community.active && (
                                  <DotFilledIcon className="w-8 h-8 text-gray-500" />
                                )}
                              </div>
                              <div className="flex gap-2 flex-wrap items-center">
                                <CardDescription>
                                  {community.type}
                                </CardDescription>
                                <span>-</span>
                                <CardDescription>
                                  <span> {community.members} member</span>
                                </CardDescription>
                              </div>
                            </div>

                            <Badge className="ml-auto">Private</Badge>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Join Private Community</DialogTitle>
                          </DialogHeader>
                          <form
                            action={async (formData) => {
                              const inviteCode = formData
                                .get("inviteCode")
                                ?.toString();

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

                              router.push(
                                `/communities/${community.communityId}`
                              );
                            }}
                            className="grid gap-4 py-4"
                          >
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="inviteCode"
                                className="text-right"
                              >
                                Invite Code
                              </Label>
                              <Input
                                name="inviteCode"
                                id="inviteCode"
                                placeholder="Enter invite code"
                                className="col-span-3"
                              />
                            </div>

                            <JoinPrivateCommunityButton />
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <Button
                      disabled={community.visibility === "private"}
                      key={community.communityId}
                      variant="outline"
                      asChild
                      className="w-full rounded-[15px] disabled:cursor-not-allowed h-fit justify-start px-3 py-[0.5rem]"
                    >
                      <Link
                        href={`/communities/${community.communityId}`}
                        className="w-full flex gap-4 justify-start"
                      >
                        <Image
                          src={
                            community.communityImage.length > 1
                              ? community.communityImage
                              : "/assets/Images/cover.png"
                          }
                          width={100}
                          height={100}
                          alt="community image"
                          className="rounded-full w-[40px] h-[40px]"
                        />
                        <div className="flex flex-col">
                          <div className="flex gap-3 items-center">
                            <CardTitle>{community.name}</CardTitle>

                            {community.active && (
                              <DotFilledIcon className="w-8 h-8 text-green-500 animate-pulse" />
                            )}

                            {!community.active && (
                              <DotFilledIcon className="w-8 h-8 text-gray-500" />
                            )}
                          </div>
                          <CardDescription>{community.type}</CardDescription>
                        </div>
                        <Badge className="ml-auto">Public</Badge>
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        <div className="absolute bottom-0 left-0 right-0 w-[90%] flex flex-wrap gap-3 mx-auto py-5">
          <a
            href="https://github.com/emmanueltaiwo/clutch"
            className="font-bold text-[12px] text-gray-900 dark:text-gray-400"
          >
            Report a Problem
          </a>
          <a
            href="https://github.com/emmanueltaiwo/clutch"
            className="font-bold text-[12px] text-gray-900 dark:text-gray-400"
          >
            Privacy Policy
          </a>
          <p className="font-bold text-[12px] text-gray-900 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Emmanuel Taiwo
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RightPanel;
