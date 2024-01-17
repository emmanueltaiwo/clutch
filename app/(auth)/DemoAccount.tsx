"use client";

import React, { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";
import { handleDemoAccountAuthentication } from "@/services/auth";
import { useAppDispatch } from "@/lib/hooks";
import { addUser } from "@/lib/features/auth/authSlice";

const DemoAccount = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginToDemoAccount = async () => {
    try {
      setIsPending(true);
      const userData = await handleDemoAccountAuthentication();
      if (!userData) return;
      dispatch(addUser(userData));
      router.push("/feed");
      setIsPending(false);
    } catch {
      throw new Error("Error while login to demo account, try again");
    }
  };
  return (
    <button
      onClick={loginToDemoAccount}
      aria-disabled={isPending}
      type="button"
      className={`${
        isPending
          ? "w-[90%] p-4 rounded-[10px] bg-red-900 cursor-not-allowed disabled text-white font-[400] text-[16px]"
          : "w-[90%] p-4 rounded-[10px] bg-[#903AFF] text-white font-[400] text-[16px] flex gap-3 items-center justify-center"
      }`}
    >
      Try a Demo Account
      <AutoAwesomeIcon />
    </button>
  );
};

export default DemoAccount;
