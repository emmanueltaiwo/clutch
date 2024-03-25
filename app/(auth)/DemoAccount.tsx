"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleDemoAccountAuthentication } from "@/services/auth";
import { useAppDispatch } from "@/lib/hooks";
import { addUser } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";

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

  if (isPending) {
    return (
      <Button
        disabled
        className="w-[90%] bg-[#903AFF] p-5 text-white hover:bg-[#8a4add] rounded-md"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return (
    <Button
      onClick={loginToDemoAccount}
      type="button"
      className="w-[90%] bg-[#903AFF] p-5 text-white hover:bg-[#8a4add] rounded-md"
    >
      Demo Account
    </Button>
  );
};

export default DemoAccount;
