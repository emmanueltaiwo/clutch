"use client";

import React, { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { handleLoginAuthentication } from "@/services/auth";
import DemoAccount from "../DemoAccount";
import AuthInput from "../AuthInput";
import { AuthResponse } from "@/types/auth-types";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { addUser } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const initialState = {
  message: "",
};

export const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        disabled
        className="w-[90%] bg-[#903AFF] p-5 text-white hover:bg-[#8a4add]"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      className="w-[90%] bg-[#903AFF] p-5 text-white hover:bg-[#8a4add]"
    >
      {children}
    </Button>
  );
};

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginUser = async (prevState: AuthResponse, formData: FormData) => {
    try {
      const login = await handleLoginAuthentication(prevState, formData);
      if (!login?.user) return { message: "An error occurred! make sure all fields are valid and try again" };

      if (
        login.message !==
        "You've logged in successfully. redirecting you to your feed now"
      ) {
        return login;
      }

      dispatch(addUser({ ...login.user }));
      router.push("/feed");
      return login;
    } catch (error) {
      return { message: "Unknow Error, refresh the page and try again" };
    }
  };
  const [state, formAction] = useFormState(loginUser, initialState);

  return (
    <form
      action={formAction}
      className="w-full h-full py-10 flex flex-col gap-5 items-center"
    >
      <DemoAccount />

      <div className="flex w-[90%] items-center gap-2">
        <hr className="w-full border-[0.3px] border-gray-200" />
        <span className="text-gray-200 text-[15px] font-[300]">Or</span>
        <hr className="w-full border-[0.3px] border-gray-200" />
      </div>

      <div className="flex flex-col w-[90%] space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <AuthInput type="email" placeholder="Enter your email" name="email" />
      </div>

      <div className="flex w-[90%] flex-col space-y-1.5">
        <Label htmlFor="name">Password</Label>
        <AuthInput
          type="password"
          placeholder="Enter your password"
          name="password"
        />
      </div>

      <SubmitButton>Login</SubmitButton>

      {state.message.length > 1 && (
        <p
          aria-live="polite"
          className="text-gray-200 text-center text-[14px] w-[90%]"
        >
          {state?.message}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
