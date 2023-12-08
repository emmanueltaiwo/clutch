import React from "react";

const Header = () => {
  return (
    <header className="w-full sticky h-20 bg-[rgb(2,2,26)] flex justify-between items-center text-white">
      <div className="ml-10">Logo</div>
      <div>Links</div>
      <div className="mr-10">Authentication Links</div>
    </header>
  );
};

export default Header;
