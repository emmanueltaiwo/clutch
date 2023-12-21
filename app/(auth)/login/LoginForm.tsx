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

const initialState = {
  message: "",
};

export const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={`${
        pending
          ? "w-[90%] p-4 rounded-[10px] bg-red-900 cursor-not-allowed disabled text-white font-[400] text-[16px]"
          : "w-[90%] p-4 rounded-[10px] bg-[#8f3aff64] hover:bg-[#8133e798] active:border-2 active:border-violet-700 text-white font-[400] text-[16px]"
      }`}
    >
      {children}
    </button>
  );
};

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginUser = async (prevState: AuthResponse, formData: FormData) => {
    try {
      const login = await handleLoginAuthentication(prevState, formData);
      if (!login || !login.user) return { message: "Error login attempt" };
      if (
        login.message !==
        "Yay! You've logged in successfully. redirecting you now"
      ) {
        return login;
      }

      dispatch(addUser({ ...login.user }));
      router.push("/feed");
      return login;
    } catch (error) {
      return { message: "Unknow Error, Try again" };
    }
  };
  const [state, formAction] = useFormState(loginUser, initialState);

  return (
    <form
      action={formAction}
      className="w-full h-full py-10 flex flex-col gap-10 items-center"
    >
      <DemoAccount />

      <div className="flex w-[90%] items-center gap-2">
        <hr className="w-full border-[0.3px] border-gray-500" />
        <span className="text-gray-400 text-[15px] font-[300]">Or</span>
        <hr className="w-full border-[0.3px] border-gray-500" />
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Enter E-mail Address:
        </label>
        <AuthInput
          type="email"
          placeholder="clutchuser@hello.com"
          name="email"
        />
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Enter Password:
        </label>
        <AuthInput type="password" placeholder="*********" name="password" />
      </div>

      <SubmitButton>Login</SubmitButton>

      <p
        aria-live="polite"
        className="text-gray-200 text-center text-[14px] w-[90%]"
      >
        {state?.message}
      </p>
    </form>
  );
};

export default LoginForm;
