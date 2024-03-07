"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { ModeToggle } from "./ToogleTheme";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { fetchUserCommunities } from "@/services/communities";
import { handleUserSignout } from "@/services/auth";
import { Community } from "@/types/communities-types";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { openSidebar, closeSidebar } from "@/lib/features/sidebar/sidebarSlice";
import {
  SIDEBAR_LINKS,
  SIDEBAR_SUB_LINKS,
  iconComponents,
  subIconComponents,
} from "@/constants";
import CommunitySkeleton from "./CommunitySkeleton";

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>("");
  const { data, isLoading } = useQuery<Community[]>({
    queryKey: ["user-communities"],
    queryFn: async () => await fetchUserCommunities(),
    staleTime: 0,
  });

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const signout = await handleUserSignout();

      if (!signout) router.push("/feed");

      router.push("/login");
    } catch (error) {}
  };

  const skeletonCards = Array.from({ length: 2 }, (_, index) => (
    <div key={index} className="w-full flex flex-col gap-3">
      <CommunitySkeleton />
    </div>
  ));

  return (
    <aside
      className={`${
        isOpen
          ? "flex-none sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-100 dark:bg-gray-900 top-0 bottom-0 fixed left-0 overflow-y-auto overflow-hidden transition-all duration-500 z-50"
          : "w-[20%] sm:w-[10%] md:w-[9%] lg:w-[8%] xl:w-[5%] bg-gray-100 dark:bg-gray-900 top-0 bottom-0 fixed left-0 overflow-y-auto overflow-hidden duration-500"
      } z-50`}
    >
      {isOpen && (
        <nav className="flex flex-col gap-5 p-5 pb-10">
          <div className="flex justify-between items-center">
            <Logo />

            <div className="mt-5 flex items-center gap-3">
              <ModeToggle />
              <button
                onClick={() => {
                  dispatch(closeSidebar());
                }}
                className="text-gray-900 dark:text-white p-1 rounded-full bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)] dark:hover:bg-[rgba(24,29,40,0.99)] transition-all duration-200"
              >
                <ChevronLeftIcon />
              </button>
            </div>
          </div>

          <ul className="mt-10 flex flex-col gap-4">
            <li className="text-gray-500 dark:text-gray-400 text-[14px] font-[500]">
              Menu
            </li>
            {SIDEBAR_LINKS.map((item) => {
              const IconComponent = iconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 hover:bg-[rgb(222,222,222)] dark:hover:bg-[rgba(38,47,66,0.86)]"
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

            {isLoading && skeletonCards}

            {data && data.length < 1 ? (
              <Link
                href="/communities"
                className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w-full px-4 py-3 rounded-[10px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
              >
                Find Communities
              </Link>
            ) : (
              data?.slice(0, 5).map((community) => (
                <Link
                  key={community.communityID}
                  href={`communities/${community.communityCategory}/${community.communityID}`}
                  className="text-[13px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 hover:bg-[rgb(222,222,222)] dark:hover:bg-[rgba(38,47,66,0.86)]"
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
            {SIDEBAR_SUB_LINKS.map((item) => {
              const IconComponent = subIconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 hover:bg-[rgb(222,222,222)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                  {item.title}
                </Link>
              );
            })}
          </ul>

          <button
            className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[15px] transition-all duration-200 bg-[rgb(222,222,222)] dark:bg-[rgba(38,47,66,0.86)] mt-auto"
            onClick={handleLogout}
          >
            <LogoutIcon />
            Log Out
          </button>
        </nav>
      )}

      {!isOpen && (
        <nav className="flex flex-col items-center gap-5 p-5 pb-10">
          <div className="flex flex-col gap-5 justify-between">
            <Link href="/feed">
              <Image
                src="/assets/Images/logoIcon.svg"
                width={30}
                height={30}
                alt="Clutch logo"
                className="dark:inline hidden"
              />
            </Link>

            <Link href="/feed">
              <Image
                src="/assets/Images/logoIconBg.svg"
                width={30}
                height={30}
                alt="Clutch logo"
                className="dark:hidden inline"
              />
            </Link>

            <div className="flex items-center gap-3">
              <div className={`${isOpen ? "inline" : "hidden"}`}>
                <ModeToggle />
              </div>

              <button
                onClick={() => {
                  dispatch(openSidebar());
                }}
                className="text-gray-900 dark:text-white p-1 rounded-full bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)] dark:hover:bg-[rgba(24,29,40,0.99)] transition-all duration-200"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <ul className="mt-7 flex flex-col gap-3">
            {SIDEBAR_LINKS.map((item) => {
              const IconComponent = iconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[10px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                </Link>
              );
            })}
          </ul>

          {data && data.length >= 1 && (
            <>
              <hr className="w-full border-[0.4px] border-gray-600" />

              <div className="w-full flex flex-col gap-3">
                {data?.slice(0, 5).map((community) => (
                  <Link
                    key={community.communityID}
                    href={`communities/${community.communityCategory}/${community.communityID}`}
                    className="text-[13px] font-[400] text-gray-900 dark:text-gray-200 flex items-center justify-center py-2 hover:animate-spin"
                  >
                    <Image
                      src={community.communityPic ?? "/assets/Images/cover.png"}
                      width={50}
                      height={50}
                      alt="community image"
                      className="rounded-full min-w-[40px] h-[40px]"
                    />
                  </Link>
                ))}
              </div>
            </>
          )}

          <hr className="w-full border-[0.4px] border-gray-600" />

          <ul className="flex flex-col gap-3 pb-10">
            {SIDEBAR_SUB_LINKS.map((item) => {
              const IconComponent = subIconComponents[item.icon];
              const isActiveLink = item.route == activeLink;

              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`${
                    isActiveLink
                      ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 px-2 py-3 rounded-[15px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)]"
                      : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 px-2 py-3 rounded-[10px] transition-all duration-200 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-[rgba(38,47,66,0.86)]"
                  }`}
                >
                  <IconComponent />
                </Link>
              );
            })}
          </ul>

          <button
            className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[5px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-[rgba(38,47,66,0.86)] mt-auto"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </button>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
