import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/">
      {/* <p className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
        Logo
      </p> */}

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
