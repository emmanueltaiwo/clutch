"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const BackgroundIllustrations = () => {
  return (
    <div className="absolute hidden sm:inline">
      {/* Star icon is top left */}
      <Image
        src="/assets/Images/star.png"
        width={20}
        height={20}
        alt="Star Image"
        className="relative sm:top-[-300px] sm:left-[-200px] md:left-[-100px] lg:left-[-300px] xl:left-[-500px]"
      />
      {/* Star icon is bottom left */}
      <Image
        src="/assets/Images/star.png"
        width={20}
        height={20}
        alt="Star Image"
        className="relative top-[300px] sm:left-[-300px] md:left-[-250px] lg:left-[-450px] xl:left-[-650px]"
      />
      {/* Star icon is top right */}
      <Image
        src="/assets/Images/star.png"
        width={20}
        height={20}
        alt="Star Image"
        className="relative top-[-200px] sm:left-[250px] md:left-[200px] lg:left-[200px] xl:left-[400px]"
      />
      {/* Star icon is bottom right */}
      <Image
        src="/assets/Images/star.png"
        width={20}
        height={20}
        alt="Star Image"
        className="relative top-[300px] sm:left-[250px] md:left-[200px] lg:left-[400px] xl:left-[600px]"
      />
    </div>
  );
};

const Banner = () => {
  return (
    <div className="w-full h-[80vh] flex flex-col gap-5 justify-center items-center">
      <BackgroundIllustrations />
      <span className="border-[#903AFF] border-2 rounded-[50px] px-8 py-2 w-fit h-fit text-white">
        Community Based App
      </span>
      <h1 className="text-[30px] sm:text-[50px] md:text-[60px] lg:text-[80px] xl:text-[100px] mt-5 font-black text-white text-center lg:leading-[100px]">
        <span className="text-[#903AFF]">Connect.</span>
        <span className="text-[#D434FE]">Share.</span>
        <span className="text-[#FE34B9]">Thrive.</span>
        <br />
        <span>Welcome to Clutch</span>
      </h1>
      <h4 className="text-gray-200 text-[14px] w-[90%] sm:w-[60%] md:w-[500px] lg:w-[600px] text-center font-[400]">
        Where communities grow and quality connections take center stage. Join
        us in shaping a space where ideas spark, network increases, and
        meaningful communities come to life
      </h4>
      <Link
        href="/signup"
        className="text-white font-[500] mt-5 text-[15px] md:text-[20px] px-16 sm:px-16 py-3 md:px-20 md:py-4 rounded-[5px] border-2 border-[#903AFF]"
      >
        Join Now
      </Link>
    </div>
  );
};

export default Banner;
