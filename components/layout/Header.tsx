"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import WidgetsIcon from "@mui/icons-material/Widgets";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { handleCookies } from "@/services/auth";
import Logo from "../Logo";

const MenuItem = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick: () => void;
}) => (
  <Link
    className="text-gray-400 font-medium text-[15px] ml-5 w-[60%] py-2 px-4 rounded-[10px] hover:bg-[rgb(13,13,58)]"
    href={href}
    onClick={onClick}
  >
    {children}
  </Link>
);

const MobileHeader = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  return (
    <nav className="md:hidden flex items-center">
      {!menuIsOpen && (
        <button className="text-white mr-5" onClick={() => setMenuIsOpen(true)}>
          <WidgetsIcon fontSize="large" />
        </button>
      )}
      {menuIsOpen && (
        <AnimatePresence>
          <button
            className="text-white mr-5"
            onClick={() => setMenuIsOpen(false)}
          >
            <CloseIcon fontSize="large" />
          </button>
          <div
            className="right-0 top-0 bottom-0 fixed bg-[#00000032] h-full w-full z-40"
            onClick={() => setMenuIsOpen(false)}
            onKeyDown={() => setMenuIsOpen(false)}
          />
          <motion.ul
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="w-[30vh] h-full flex flex-col gap-10 fixed top-0 left-0 right-0 bottom-0 z-50 bg-[rgb(2,2,26)] shadow-lg shadow-gray-600"
          >
            <div className="ml-5 px-3 h-24 items-center flex md:ml-10 lg:ml-2">
              <Logo />
            </div>
            <MenuItem onClick={() => setMenuIsOpen(false)} href="/">
              Home
            </MenuItem>
            <MenuItem onClick={() => setMenuIsOpen(false)} href="/#features">
              Features
            </MenuItem>
            <MenuItem
              onClick={() => setMenuIsOpen(false)}
              href="/#contributors"
            >
              Contributors
            </MenuItem>

            <ul className="mt-auto mb-5 ml-5 flex flex-col gap-5">
              <Link
                className="text-white font-medium text-[15px] w-[60%] text-center h-fit px-5 py-2 rounded-[10px] border-2 border-[#903AFF] hover:bg-[#8f3aff64]"
                href="/login"
                onClick={() => setMenuIsOpen(false)}
              >
                Login
              </Link>

              {isAuthenticated ? (
                <Link
                  className="text-white font-medium text-[15px] w-[60%] text-center h-fit px-5 py-2 rounded-[10px] border-2 border-[#903AFF] hover:bg-[#8f3aff64]"
                  href="/feed"
                  onClick={() => setMenuIsOpen(false)}
                >
                  Go To Feed
                </Link>
              ) : (
                <Link
                  className="text-white font-medium text-[15px] w-[60%] text-center h-fit px-5 py-2 rounded-[10px] border-2 border-[#903AFF] hover:bg-[#8f3aff64]"
                  href="/signup"
                  onClick={() => setMenuIsOpen(false)}
                >
                  Signup
                </Link>
              )}
            </ul>
          </motion.ul>
        </AnimatePresence>
      )}
    </nav>
  );
};

const DesktopHeader = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <nav className="hidden md:flex justify-between lg:w-[70%] xl:w-[65%]">
      <ul className="flex gap-10 xl:gap-20 items-center md:mr-10 lg:mr-0">
        <li className="text-gray-400 font-medium text-[15px] py-2 px-4 rounded-[10px] hover:bg-[rgb(13,13,58)]">
          <Link href="/">Home</Link>
        </li>
        <li className="text-gray-400 font-medium text-[15px] py-2 px-4 rounded-[10px] hover:bg-[rgb(13,13,58)]">
          <Link href="/#features">Features</Link>
        </li>
        <li className="text-gray-400 font-medium text-[15px] py-2 px-4 rounded-[10px] hover:bg-[rgb(13,13,58)]">
          <Link href="/#contributors">Contributors</Link>
        </li>
      </ul>

      <ul className="mr-10 lg:mr-20 flex gap-5 lg:gap-10 items-center">
        <Link
          className="font-medium text-[15px] w-fit h-fit px-5 py-2 rounded-[10px] border-2 border-[#903AFF] text-[#903AFF] hover:bg-[#8f3aff64]"
          href="/login"
        >
          Login
        </Link>
        {isAuthenticated ? (
          <Link
            className="text-white font-medium text-[15px] w-fit h-fit px-5 py-2 rounded-[10px] border-2 border-[#7119e6] hover:bg-[#8f3aff64]"
            href="/feed"
          >
            Go To Feed
          </Link>
        ) : (
          <Link
            className="text-white font-medium text-[15px] w-fit h-fit px-5 py-2 rounded-[10px] border-2 border-[#7119e6] hover:bg-[#8f3aff64]"
            href="/signup"
          >
            Signup
          </Link>
        )}
      </ul>
    </nav>
  );
};

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkUserAuthenticationState = () => {
      try {
        const userHasToken = handleCookies("get", "USER_ID");
        if (!userHasToken) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        return false;
      }
    };
    checkUserAuthenticationState();
  }, []);

  return (
    <header className="w-full z-50 sticky top-0 h-24 bg-[rgb(2,2,26)] flex justify-between items-center text-white">
      <div className="ml-5 md:ml-10 lg:ml-20">
        <Logo />
      </div>
      <MobileHeader isAuthenticated={isAuthenticated} />
      <DesktopHeader isAuthenticated={isAuthenticated} />
    </header>
  );
};

export default Header;
