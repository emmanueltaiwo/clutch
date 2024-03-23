"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateCommunity from "./CreateCommunity";
import YourCommunities from "./YourCommunities";
import FindCommunities from "./FindCommunities";

const CommunityTab = () => {
  return (
    <Tabs defaultValue="createCommunity" className="w-full">
      <TabsList>
        <TabsTrigger value="createCommunity">Create A Community</TabsTrigger>
        <TabsTrigger value="yourCommunities">Your Communities</TabsTrigger>
        <TabsTrigger value="findCommunity">Find A Community</TabsTrigger>
      </TabsList>
      <TabsContent value="createCommunity">
        <CreateCommunity />
      </TabsContent>
      <TabsContent value="yourCommunities">
        <YourCommunities />
      </TabsContent>
      <TabsContent value="findCommunity">
        <FindCommunities />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTab;
