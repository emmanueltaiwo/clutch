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
import { handleUserSignout } from "@/services/auth";
import { Community } from "@/types";
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
import { fetchUserCommunities } from "@/services/communities";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";

const Sidebar = ({ username }: { username: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>("");
  const { data, isLoading } = useQuery<Community[]>({
    queryKey: ["my-communities"],
    queryFn: async () => await fetchUserCommunities(),
  });

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const isSmallDevice = useMediaQuery({ maxWidth: 768 });

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
    <Card
      className={`${
        isOpen
          ? "flex-none w-fit rounded-none top-0 bottom-0 fixed left-0 overflow-y-auto overflow-hidden transition-all duration-500 z-50"
          : "w-fit rounded-none top-0 bottom-0 fixed left-0 overflow-y-auto overflow-hidden transition-all duration-500 z-[1000px]"
      } z-50 border-t-0 border-l-0 border-b-0`}
    >
      <Card
        className={`${
          isOpen
            ? "w-[80%] md:w-[33%] lg:w-1/4 xl:w-[19.95%]"
            : "w-[0px] md:inline md:w-[9%] lg:w-[8%] xl:w-[5%]"
        } h-full overflow-y-auto fixed rounded-none border-t-0 border-l-0 border-b-0`}
      >
        {isOpen && (
          <nav className="flex flex-col gap-5 p-5 pb-10">
            <div className="flex justify-between items-center">
              <Logo />

              <div className="mt-5 flex items-center gap-3">
                <ModeToggle />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    dispatch(closeSidebar());
                  }}
                  className="p-1 rounded-full"
                >
                  <ChevronLeftIcon />
                </Button>
              </div>
            </div>

            <ul className="mt-10 flex flex-col gap-4">
              <CardTitle className="text-[14px] font-[500]">Menu</CardTitle>
              {SIDEBAR_LINKS.map((item) => {
                const IconComponent = iconComponents[item.icon];
                const isActiveLink = item.route == activeLink;

                return (
                  <Link
                    onClick={
                      isSmallDevice ? () => dispatch(closeSidebar()) : undefined
                    }
                    key={item.id}
                    href={item.route}
                    className={`${
                      isActiveLink
                        ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 px-2 py-3 rounded-[10px] bg-[rgb(222,222,222)] dark:bg-gray-900"
                        : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 px-2 py-3 rounded-[10px] hover:bg-[rgb(222,222,222)] dark:hover:bg-gray-900"
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
              <CardTitle className="text-[14px] font-[500]">
                My Communities
              </CardTitle>

              {isLoading && skeletonCards}

              {data && data.length < 1 ? (
                <Link
                  onClick={
                    isSmallDevice ? () => dispatch(closeSidebar()) : undefined
                  }
                  href="/communities"
                  className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w-full px-4 py-3 rounded-[10px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-gray-900"
                >
                  Find Communities
                </Link>
              ) : (
                data?.slice(0, 5).map((community) => (
                  <Link
                    onClick={
                      isSmallDevice ? () => dispatch(closeSidebar()) : undefined
                    }
                    key={community.communityId}
                    href={`/communities/${community.communityId}`}
                    className="text-[13px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 px-2 py-3 rounded-[10px] hover:bg-[rgb(222,222,222)] dark:hover:bg-gray-900"
                  >
                    <Image
                      src={
                        community.communityImage.length > 1
                          ? community.communityImage
                          : "/assets/Images/cover.png"
                      }
                      width={50}
                      height={50}
                      alt="community image"
                      className="rounded-full w-[30px] h-[30px]"
                    />
                    {community.name} ({community.members || "0"}{" "}
                    {community.members > 1 ? "members" : "member"})
                  </Link>
                ))
              )}
            </ul>

            <hr className="w-full border-[0.4px] border-gray-600" />

            <ul className="flex flex-col gap-3 pb-10">
              {SIDEBAR_SUB_LINKS.map((item) => {
                const IconComponent = subIconComponents[item.icon];
                const isActiveLink =
                  item.route === `/profile` && `/${username}` === activeLink
                    ? true
                    : item.route === activeLink;

                return (
                  <Link
                    onClick={
                      isSmallDevice ? () => dispatch(closeSidebar()) : undefined
                    }
                    key={item.id}
                    href={
                      item.route === "/profile"
                        ? `/profile/${username}`
                        : item.route
                    }
                    className={`${
                      isActiveLink
                        ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] bg-[rgb(222,222,222)] dark:bg-gray-900"
                        : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] hover:bg-[rgb(222,222,222)] dark:hover:bg-gray-900"
                    }`}
                  >
                    <IconComponent />
                    {item.title}
                  </Link>
                );
              })}
            </ul>

            <button
              className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex items-center gap-5 w[90%] px-2 py-3 rounded-[10px] bg-[rgb(222,222,222)] dark:bg-gray-900 mt-auto"
              onClick={() => {
                isSmallDevice
                  ? (dispatch(closeSidebar()), handleLogout())
                  : handleLogout();
              }}
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
                  className="text-gray-900 dark:text-white p-1 rounded-full bg-[rgba(125,133,150,0.86)] dark:bg-gray-900 dark:hover:bg-gray-900/50 transition-all duration-200"
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
                        ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 px-2 py-3 rounded-[10px] transition-all duration-100 bg-[rgba(125,133,150,0.86)] dark:bg-gray-900"
                        : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 px-2 py-3 rounded-[10px] transition-all duration-100 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-gray-900"
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
                      key={community.communityId}
                      href={`/communities/${community.communityId}`}
                      className="text-[13px] font-[400] text-gray-900 dark:text-gray-200 flex items-center justify-center py-2 hover:animate-spin"
                    >
                      <Image
                        src={
                          community.communityImage.length > 1
                            ? community.communityImage
                            : "/assets/Images/cover.png"
                        }
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
                const isActiveLink =
                  item.route === `/profile` && `/${username}` === activeLink
                    ? true
                    : item.route === activeLink;

                return (
                  <Link
                    key={item.id}
                    href={
                      item.route === "/profile" ? `/${username}` : item.route
                    }
                    className={`${
                      isActiveLink
                        ? "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 px-2 py-3 rounded-[10px] transition-all duration-100 bg-[rgba(125,133,150,0.86)] dark:bg-gray-900"
                        : "text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 px-2 py-3 rounded-[10px] transition-all duration-100 hover:bg-[rgba(125,133,150,0.86)] dark:hover:bg-gray-900"
                    }`}
                  >
                    <IconComponent />
                  </Link>
                );
              })}
            </ul>

            <button
              className="text-[14px] font-[400] text-gray-900 dark:text-gray-200 flex w-fit h-fit items-center gap-5 w[90%] px-2 py-3 rounded-[5px] transition-all duration-200 bg-[rgba(125,133,150,0.86)] dark:bg-gray-900 mt-auto"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </button>
          </nav>
        )}
      </Card>
    </Card>
  );
};

export default Sidebar;
