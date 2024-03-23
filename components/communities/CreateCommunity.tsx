"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const CreateCommunity = () => {
  return (
    <Card className="min-w-full mt-5">
      <CardHeader>
        <CardTitle>Create your community</CardTitle>
        <CardDescription>
          Get your community running with one click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="communityName">Community Name</Label>
              <Input id="communityName" placeholder="Name of your community" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="communityType">Community Type</Label>
              <Select>
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
              <Select>
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
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Create Community</Button>
      </CardFooter>
    </Card>
  );
};

export default CreateCommunity;
