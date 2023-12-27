import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import Logo from "../../Logo";

const Footer = () => {
  return (
    <footer className="relative bottom-0 w-full h-fit py-12 md:py-0 md:h-[12rem] bg-[rgb(14,14,52)] flex flex-wrap gap-10 items-center justify-between">
      <div className="ml-5 md:ml-10 lg:ml-20 text-white text-[20px] font-bold flex flex-col gap-10">
        <Logo />
        <h4 className="text-gray-400 text-[14px] md:w-[500px] w-[90%] lg:w-[600px] font-[400]">
          Where communities grow and quality connections take center stage. Join
          us in shaping a space where ideas spark, network increases, and
          meaningful communities come to life
        </h4>
      </div>

      <ul className="mx-5 md:mx-10 lg:mx-20 flex items-center gap-5 text-gray-300">
        <a href="https://github.com/realemmanuel/clutch">
          <GitHubIcon fontSize="large" />
        </a>
        <a href="https://twitter.com/thedevemmanuel">
          <TwitterIcon fontSize="large" />
        </a>
      </ul>
    </footer>
  );
};

export default Footer;
