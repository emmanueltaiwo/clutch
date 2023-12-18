"use client";

import React from "react";
import DemoAccount from "../DemoAccount";
import { useFormState } from "react-dom";
import { handleSignupAuthentication } from "@/services/auth";
import Link from "next/link";
import { SubmitButton } from "../login/LoginForm";
import AuthInput from "../AuthInput";
import { AuthResponse } from "@/types/auth-types";
import { useRouter } from "next/navigation";
import { countries, gender, interests } from "@/data/form";

const initialState = {
  message: "",
};

const SignupForm = () => {
  const router = useRouter();

  const signupUser = async (prevState: AuthResponse, formData: FormData) => {
    try {
      const login = await handleSignupAuthentication(prevState, formData);
      if (!login) return { message: "Error login attempt" };
      if (
        login.message !==
        "Yay! You've succesfully created an account on clutch. redirecting you now"
      ) {
        return login;
      }
      router.push("/");
      return login;
    } catch (error) {
      return { message: "Unknow Error, Try again" };
    }
  };
  const [state, formAction] = useFormState(signupUser, initialState);

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
          name="email"
          placeholder="clutchuser@clutch.com"
        />
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Enter Full name:
        </label>
        <AuthInput type="text" name="fullName" placeholder="Clutch User" />
      </div>

      <div className="w-[90%] flex flex-wrap md:flex-nowrap items-center gap-5">
        <div className="flex flex-col gap-4 w-full">
          <label className="text-white font-[400] text-[14px]">
            Enter Phone number:
          </label>
          <AuthInput
            type="text"
            name="phoneNumber"
            placeholder="+ 123-456-789"
          />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <label className="text-white font-[400] text-[14px]">
            Enter Date of birth:
          </label>
          <AuthInput type="date" name="dateOfBirth" />
        </div>
      </div>

      <div className="w-[90%] flex flex-wrap md:flex-nowrap items-center gap-5">
        <div className="flex flex-col gap-4 w-full">
          <label className="text-white font-[400] text-[14px]">
            Select Gender:
          </label>
          <select
            className="w-full p-4 rounded-[10px] border-2 border-[rgb(43,43,125)] text-white placeholder:text-white font-[400] text-[14px] bg-transparent outline-none"
            name="gender"
          >
            <option value="default" disabled selected>
              Select your gender
            </option>
            {gender.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <label className="text-white font-[400] text-[14px]">
            Select Country:
          </label>
          <select
            name="country"
            className="w-full p-4 rounded-[10px] border-2 border-[rgb(43,43,125)] text-white placeholder:text-white font-[400] text-[14px] bg-transparent outline-none"
          >
            <option value="default" disabled selected>
              Select your country, you can change this later
            </option>
            {countries.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Select Interest:
        </label>
        <select
          name="interest"
          className="w-full p-4 rounded-[10px] border-2 border-[rgb(43,43,125)] text-white placeholder:text-white font-[400] text-[14px] bg-transparent outline-none"
        >
          <option value="default" disabled selected>
            Select your top interest, you can change this later
          </option>
          {interests.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4 w-[90%]">
        <label className="text-white font-[400] text-[14px]">
          Enter Password:
        </label>
        <AuthInput type="password" placeholder="*********" name="password" />
      </div>

      <div className="w-[90%] flex gap-3 items-center">
        <input type="checkbox" name="termsAndConditions" />
        <span className="text-white font-[400] text-[14px]">
          Do you agree to our{" "}
          <Link className="text-gray-400 underline italic" href="/">
            Terms & conditions
          </Link>
        </span>
      </div>

      <SubmitButton>Sign Up</SubmitButton>

      <p
        aria-live="polite"
        className="text-gray-200 text-center text-[14px] w-[90%]"
      >
        {state?.message}
      </p>
    </form>
  );
};

export default SignupForm;
