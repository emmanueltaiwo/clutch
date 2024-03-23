"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const CommunityCard = () => {
  return (
    <Card className="hover:bg-[rgba(48,48,48,0.15)] transition-all duration-300 cursor-pointer">
      <CardHeader>
        <CardTitle>Technology Experts</CardTitle>
        <CardDescription>
          This community is for tech enthusiasts. We discuss about tech, Join
          and have fun.
        </CardDescription>
        <CardDescription>78,233 members</CardDescription>
      </CardHeader>

      <CardContent>
        <Image
          src="/assets/Images/cover.png"
          width={1000}
          height={1000}
          alt="Community Image"
          className="w-full h-[500px]"
        />
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href="#">Join Community</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
