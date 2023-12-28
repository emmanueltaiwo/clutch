import React from "react";
import LoginForm from "./LoginForm";
import { BackgroundIllustrations } from "@/components/Home/Banner";
import Logo from "@/components/Logo";

const Login = () => {
  return (
    <main className="w-full h-full flex justify-center py-10 lg:py-12">
      <BackgroundIllustrations />
      <section className="w-[93%] md:w-[700px] h-full md:h-fit rounded-[10px] bg-[rgb(11,11,41)] flex flex-col gap-5 py-10 m-auto items-center ">
        <Logo />
        <LoginForm />
      </section>
    </main>
  );
};

export default Login;
