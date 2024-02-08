"use client";

import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import AdminPostOptions from "./AdminPostOptions";

const PageHeader = ({
  postUserId,
  userId,
}: {
  postUserId: string;
  userId: string;
}) => {
  const [postCreatedByUser, setPostCreatedByUser] = useState<boolean>(false);

  useEffect(() => {
    const validateAdminAccess = async () => {
      try {
        if (postUserId === userId) {
          return setPostCreatedByUser(true);
        }

        return setPostCreatedByUser(false);
      } catch (error) {
        throw new Error();
      }
    };

    validateAdminAccess();
  }, [postUserId, userId]);

  return (
    <div className="w-full flex gap-5 items-center justify-betweeen h-[11vh]">
      <div className="ml-5 flex gap-5 items-center">
        <BackButton />
        <h4 className="dark:text-white font-bold text-[25px]">Post</h4>
      </div>

      {postCreatedByUser && <AdminPostOptions />}
    </div>
  );
};

export default PageHeader;
