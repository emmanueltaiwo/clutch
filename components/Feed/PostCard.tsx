import Link from "next/link";
import React, { FC } from "react";
import PostAvatar from "./PostAvatar";

type Props = {
  postId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  fullName: string;
  createdAtString: string;
  post: string;
  postDetailPage?: boolean;
};

const PostCard: FC<Props> = ({
  postId,
  username,
  firstName,
  lastName,
  profilePic,
  fullName,
  createdAtString,
  post,
  postDetailPage,
}) => {
  return (
    <Link
      href={`/feed/${username}/${postId}`}
      key={postId}
      className={`w-full border-t-[1px] border-gray-800 dark:border-gray-700 p-5 flex flex-col gap-5 hover:bg-[rgba(48,48,48,0.24)] transition-all duration-300 ${
        !postDetailPage && "border-b-[0.5px]"
      }`}
    >
      <div className="flex justify-between items-center gap-3">
        <Link
          href={`/${firstName.toLowerCase()}${lastName.toLowerCase()}`}
          className="flex items-center gap-3"
        >
          <PostAvatar profilePic={profilePic} fullName={fullName} />

          <div className="flex flex-col hover:underline underline-offset-4 decoration-[0.5px]">
            <h4 className="font-bold text-gray-800 text-[15px] dark:text-gray-400">
              {fullName}
            </h4>
            <span className="font-[100] text-gray-800 text-[12px] dark:text-gray-400">
              @{firstName.toLowerCase()}
              {lastName.toLowerCase()}
            </span>
          </div>
        </Link>
        <p className="font-[100] text-gray-800 text-[12px] dark:text-gray-400">
          Posted {createdAtString}
        </p>
      </div>

      <p className="font-[400] text-gray-800 text-[14px] md:text-[15px] dark:text-gray-200">
        {post}
      </p>
    </Link>
  );
};

export default PostCard;
