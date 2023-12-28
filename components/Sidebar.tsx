"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { ModeToggle } from "./ToogleTheme";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  sidebarLinks,
  sidebarSubLinks,
  iconComponents,
  subIconComponents,
} from "@/data/sidebar";
import { fetchAllCommunities } from "@/services/communities";
import { Community } from "@/types/communities-types";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>("");
  const { data, isLoading } = useQuery<Community[]>({
    queryKey: ["contributors"],
    queryFn: async () => await fetchAllCommunities(),
    staleTime: 0,
  });

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <aside
      className={`${
        isOpen
          ? "w-[35vh] bg-gray-300 dark:bg-gray-900 top-0 bottom-0 fixed left-0 overflow-y-auto transition-all duration-500"
          : "w-[10vh] bg-gray-300 dark:bg-gray-900 top-0 bottom-0 fixed left-0 overflow-y-auto duration-500"
      }`}
    >
      {isOpen && (
        <nav className="flex flex-col gap-5 p-5 pb-10">
          <div className="flex justify-between items-center">
            <Logo />

            <div className="flex items-center gap-3">
              <ModeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 dark:text-white p-1 rounded-full bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)] dark:hover:bg-[rgba(24,29,40,0.99)] transition-all duration-200"
              >
                <ChevronLeftIcon />
              </button>
            </div>
          </div>

          <ul className="mt-10 flex flex-col gap-4">
            <li className="text-gray-900 dark:text-gray-400 text-[14px] font-[500]">
              Menu
            </li>
            {sidebarLinks.map((item) => {
              const IconComponent = iconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                  {item.title}
                </Link>
              );
            })}
          </ul>

          <hr className="w-full border-[0.4px] border-gray-600" />

          <ul className="flex flex-col gap-3">
            <li className="text-gray-900 dark:text-gray-400 text-[14px] font-[500]">
              My Communities
            </li>

            {isLoading && (
              <p className="font-bold text-[rgb(26,32,44)] dark:text-[rgb(205,211,226)] text-[15px] text-center">
                Loading...
              </p>
            )}

            {data && data.length < 1 ? (
              <Link
                href="/communities"
                className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-4 py-3 rounded-[15px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
              >
                Find Communities
              </Link>
            ) : (
              data?.slice(0, 5).map((community) => (
                <Link
                  key={community.communityID}
                  href={`communities/${community.communityCategory}/${community.communityID}`}
                  className="text-[13px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                >
                  <Image
                    src={community.communityPic ?? "/assets/Images/cover.png"}
                    width={50}
                    height={50}
                    alt="community image"
                    className="rounded-full w-[30px] h-[30px]"
                  />
                  {community.communityName} ({community.members || "0"} Members)
                </Link>
              ))
            )}
          </ul>

          <hr className="w-full border-[0.4px] border-gray-600" />

          <ul className="flex flex-col gap-3 pb-10">
            {sidebarSubLinks.map((item) => {
              const IconComponent = subIconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                  {item.title}
                </Link>
              );
            })}
          </ul>

          <button className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[5px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)] mt-auto">
            <LogoutIcon />
            Log Out
          </button>
        </nav>
      )}

      {!isOpen && (
        <nav className="flex flex-col gap-5 p-5 pb-10">
          <div className="flex flex-col gap-5 justify-between">
            <Image
              src="/assets/Images/logoIcon.svg"
              width={30}
              height={30}
              alt="Clutch logo"
              className="dark:inline hidden"
            />

            <Image
              src="/assets/Images/logoIconBg.svg"
              width={30}
              height={30}
              alt="Clutch logo"
              className="dark:hidden inline"
            />

            <div className="flex items-center gap-3">
              <div className={`${isOpen ? "inline" : "hidden"}`}>
                <ModeToggle />
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 dark:text-white p-1 rounded-full bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)] dark:hover:bg-[rgba(24,29,40,0.99)] transition-all duration-200"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <ul className="mt-7 flex flex-col gap-3">
            {sidebarLinks.map((item) => {
              const IconComponent = iconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                </Link>
              );
            })}
          </ul>

          <hr className="w-full border-[0.4px] border-gray-600" />

          <ul className="flex flex-col gap-3">
            {data?.slice(0, 5).map((community) => (
              <Link
                key={community.communityID}
                href={`communities/${community.communityCategory}/${community.communityID}`}
                className="text-[13px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
              >
                <Image
                  src={community.communityPic ?? "/assets/Images/cover.png"}
                  width={50}
                  height={50}
                  alt="community image"
                  className="rounded-full w-[30px] h-[30px]"
                />
              </Link>
            ))}
          </ul>

          <hr className="w-full border-[0.4px] border-gray-600" />

          <ul className="flex flex-col gap-3 pb-10">
            {sidebarSubLinks.map((item) => {
              const IconComponent = subIconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                </Link>
              );
            })}
          </ul>

          <button className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[5px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)] mt-auto">
            <LogoutIcon />
          </button>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
