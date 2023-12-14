"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { handleLoginAuthentication } from "@/lib/auth";

const initialState = {
  message: "",
};

const SubmitButton = () => {
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
      Login
    </button>
  );
};

const LoginForm = () => {
  const [state, formAction] = useFormState(
    handleLoginAuthentication,
    initialState
  );

  return (
    <form
      action={formAction}
      className="w-full h-full py-10 flex flex-col gap-10 items-center"
    >
      <button
        type="button"
        className="w-[90%] p-4 rounded-[10px] bg-[#903AFF] text-white font-[400] text-[16px] flex gap-3 items-center justify-center"
      >
        Try a Demo Account
        <AutoAwesomeIcon />
      </button>

      <div className="flex w-[90%] items-center gap-2">
        <hr className="w-full border-[0.3px] border-gray-500" />
        <span className="text-gray-400 text-[15px] font-[300]">Or</span>
        <hr className="w-full border-[0.3px] border-gray-500" />
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Enter E-mail Address:
        </label>
        <input
          type="email"
          placeholder="clutchuser@hello.com"
          name="email"
          className="w-full p-4 rounded-[10px] border-2 border-[rgb(43,43,125)] text-white placeholder:text-white font-[400] text-[14px] bg-transparent outline-none"
        />
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Enter Password:
        </label>
        <input
          type="password"
          placeholder="*********"
          name="password"
          className="w-full p-4 rounded-[10px] border-2 border-[rgb(43,43,125)] text-white placeholder:text-white font-[400] text-[14px] bg-transparent outline-none"
        />
      </div>

      <SubmitButton />

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
