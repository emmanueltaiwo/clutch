"use client";

import { FC, useState, useEffect } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOMAIN_NAME } from "@/constants";

type Props = {
  username: string;
  postId: string;
  communityPage?: boolean;
  communityId?: string;
};

const SharePost: FC<Props> = ({
  username,
  postId,
  communityPage,
  communityId,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [postUrl, setPostUrl] = useState<string>("");

  useEffect(() => {
    if (communityPage) {
      setPostUrl(`${DOMAIN_NAME}/communities/${communityId}/${postId}`);
    } else {
      setPostUrl(`${DOMAIN_NAME}/feed/${username}/${postId}`);
    }
  }, [communityPage, communityId, postId, username]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      throw new Error();
    }
  };

  return (
    <Link href="">
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-gray-600 hover:bg-[rgba(74,252,98,0.11)] hover:text-green-500 transition-all duration-300 px-[8px] pt-[3px] pb-[9px] rounded-full">
            <IosShareRoundedIcon fontSize="small" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>
              User must have an account on clutch to be able to view this post
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={postUrl} readOnly />
            </div>
            <Button
              onClick={copyToClipboard}
              type="submit"
              size="sm"
              className="px-3"
            >
              <span className="sr-only">Copy</span>
              {!copied ? (
                <CopyIcon className="h-4 w-4" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Link>
  );
};

export default SharePost;
