"use client";

import { useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "@/types";
import { Loader2 } from "lucide-react";
import PostAvatar from "@/components/Feed/PostAvatar";
import { Button } from "@/components/ui/button";
import { capitalizeWord } from "@/utils/helpers";
import Link from "next/link";
import { fetchAllCommunityMembers } from "@/services/communities";
import { Badge } from "@/components/ui/badge";

const CommunityMembers = ({
  communityId,
  communityCreator,
  userId,
}: {
  communityId: string;
  communityCreator: string;
  userId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: communityMembers, isLoading: communityMembersLoading } =
    useQuery<SearchResult[]>({
      queryKey: ["community-members", communityId],
      queryFn: async () => await fetchAllCommunityMembers(communityId),
    });

  const isMember = communityMembers?.some((member) => member.userId === userId);

  const filteredMembers = communityMembers?.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingCreatorMembers: SearchResult[] = [];
  const otherMembers: SearchResult[] = [];

  filteredMembers?.forEach((member) => {
    if (member.userId === communityCreator) {
      matchingCreatorMembers.push(member);
    } else {
      otherMembers.push(member);
    }
  });

  const sortedMembers = matchingCreatorMembers.concat(otherMembers);

  return (
    <Card className="rounded-none hidden lg:inline lg:w-[30%] xl:w-[27%] top-0 bottom-0 fixed right-0 overflow-y-auto transition-all duration-500 border-t-0 border-r-0 border-b-0">
      <div className="mt-5 flex flex-col gap-5 h-full">
        {!isMember && !communityMembersLoading ? (
          <Badge className="w-fit m-auto cursor-pointer">
            Become a member to view the list of members
          </Badge>
        ) : (
          <>
            {isMember && (
              <Card className="w-[90%] mx-auto h-[55px] flex gap-4 items-center px-4 rounded-full">
                <SearchIcon />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for members..."
                  className="h-full w-full bg-transparent outline-none dark:placeholder:text-gray-200 placeholder:text-gray-900"
                />
              </Card>
            )}

            {communityMembersLoading && searchQuery.length === 0 && (
              <Card className="w-[90%] flex justify-center items-center gap-5 mx-auto rounded-[15px] h-fit overflow-y-auto p-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </Card>
            )}

            {sortedMembers && !communityMembersLoading && (
              <Card className="w-[90%] flex flex-col gap-5 mx-auto rounded-[15px] max-h-full overflow-y-auto p-4">
                <h1 className="text-gray-900 dark:text-gray-100 text-[18px] font-[900]">
                  Community Members
                </h1>

                {sortedMembers.length === 0 && searchQuery.length > 0 && (
                  <CardTitle>
                    No member matched &quot;{searchQuery}&quot;
                  </CardTitle>
                )}

                <div className="flex flex-col gap-3">
                  {sortedMembers.map((member) => (
                    <Button
                      variant="outline"
                      className="w-full rounded-[15px] h-fit justify-start px-3 py-[0.5rem]"
                      key={member.username}
                      asChild
                    >
                      <Link
                        className="w-full flex gap-4 justify-start"
                        href={`/profile/${member.username}`}
                      >
                        <PostAvatar
                          profilePic={member.profilePic}
                          fullName={member.fullName}
                        />
                        <div className="flex flex-col">
                          <h2 className="text-[14px]">
                            {capitalizeWord(member.fullName)}
                          </h2>
                          <CardDescription>{member.username}</CardDescription>
                        </div>

                        {communityCreator === member.userId && (
                          <Badge className="px-1 ml-auto">admin</Badge>
                        )}
                      </Link>
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default CommunityMembers;
