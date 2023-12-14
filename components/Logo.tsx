import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/assets/Images/logo.png"
        width={100}
        height={100}
        alt="Clutch logo"
      />
    </Link>
  );
};

export default Logo;
