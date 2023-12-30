"use client"

import React from "react";
import Image from "next/image";

const LoadingAnimation = () => {
  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
      <Image
        src="/assets/Images/logoIcon.svg"
        width={300}
        height={300}
        alt="Person Image"
        className="rounded-full h-28 w-28"
      />
    </div>
  );
};

export default LoadingAnimation;
