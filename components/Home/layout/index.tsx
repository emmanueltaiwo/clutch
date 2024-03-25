import React, { FC, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

const Layout: FC<LayoutProps> = ({ children, isAuthenticated }) => {
  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
