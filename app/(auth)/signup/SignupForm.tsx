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
import { COUNTRIES, GENDER, INTERESTS } from "@/constants";
import { useAppDispatch } from "@/lib/hooks";
import { addUser } from "@/lib/features/auth/authSlice";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  message: "",
};

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const signupUser = async (prevState: AuthResponse, formData: FormData) => {
    try {
      const login = await handleSignupAuthentication(prevState, formData);
      if (!login || !login.user) return { message: "An error occurred! make sure all fields are valid and try again" };
      if (
        login.message !==
        "You've succesfully created an account on clutch. redirecting you to your feed now"
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
  const [state, formAction] = useFormState(signupUser, initialState);

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

      <div className="w-[90%] flex flex-wrap md:flex-nowrap items-center gap-5">
        <div className="flex flex-col w-full md:w-[90%] space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <AuthInput type="email" placeholder="Enter your email" name="email" />
        </div>

        <div className="flex flex-col w-full md:w-[90%] space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <AuthInput
            type="text"
            name="fullName"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div className="w-[90%] flex flex-wrap md:flex-nowrap items-center gap-5">
        <div className="flex flex-col w-full md:w-[90%] space-y-1.5">
          <Label htmlFor="name">Phone number</Label>
          <AuthInput
            type="text"
            name="phoneNumber"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex flex-col w-full md:w-[90%] space-y-1.5">
          <Label htmlFor="name">Phone date of birth</Label>
          <AuthInput
            type="date"
            name="dateOfBirth"
            placeholder="Enter your date of birth"
          />
        </div>
      </div>

      <div className="w-[90%] flex flex-wrap md:flex-nowrap items-center gap-5">
        <div className="flex flex-col gap-4 w-full">
          <Label>Select Gender:</Label>
          <Select name="gender">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Label>Select country:</Label>
          <Select name="country">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-[90%] flex flex-wrap md:flex-nowrap items-center gap-5">
        <div className="flex flex-col gap-4 w-full md:w-[90%]">
          <Label>Select interest:</Label>
          <Select name="interest">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select interest" />
            </SelectTrigger>
            <SelectContent>
              {INTERESTS.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[90%]">
          <Label htmlFor="password">Password</Label>
          <AuthInput
            type="password"
            placeholder="Enter your password"
            name="password"
          />
        </div>
      </div>

      <div className="w-[90%] flex gap-3 items-center">
        <input type="checkbox" name="termsAndConditions" />
        <span className="text-white font-[400] text-[14px]">
          Do you agree to our{" "}
          <Link className="text-gray-200 underline" href="/">
            Terms & conditions
          </Link>
        </span>
      </div>

      <SubmitButton>Sign Up</SubmitButton>

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

export default SignupForm;
