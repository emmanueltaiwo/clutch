"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathName = usePathname();

  return (
    <Link
      href={`${
        pathName === "/" || pathName === "/login" || pathName === "/signup"
          ? "/"
          : "/feed"
      }`}
    >
      <Image
        src="/assets/Images/logo.png"
        width={100}
        height={100}
        alt="Clutch logo"
        className="dark:inline hidden"
      />

      <Image
        src="/assets/Images/logo2.svg"
        width={100}
        height={100}
        alt="Clutch logo"
        className="dark:hidden"
      />
    </Link>
  );
};

export default Logo;
