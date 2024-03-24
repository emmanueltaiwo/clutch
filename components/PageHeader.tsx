import { ReactNode } from "react";

const PageHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full sticky top-0 flex items-center gap-2 bg-background z-50 h-[14vh] border-b-[1px] p-5">
      {children}
    </div>
  );
};

export default PageHeader;
