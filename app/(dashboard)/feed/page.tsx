"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";
import Header from "@/components/layout/Header";
import { User } from "@/types";

const Feed = () => {
  const user = useAppSelector((state) => state.auth);
  return (
    <div>
      <Header />
      <h2>
        {user.fullName} {user.email} {user.country} {user.dateOfBirth}{" "}
        {user.gender} {user.interests.map((interest) => interest)}{" "}
        {user.phoneNumber} {user.status}
      </h2>
      <h1>Welcome to clutch</h1>
    </div>
  );
};

export default Feed;
