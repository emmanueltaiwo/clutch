import React from "react";
import LoginForm from "./LoginForm";
import Logo from "@/components/Logo";
import { Card } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <main className="w-full h-full flex justify-center py-10 lg:py-12">
      <Card className="w-[93%] md:w-[600px] h-full md:h-fit flex flex-col gap-2 py-5 items-center bg-[rgb(11,11,41)]">
        <Logo />
        <LoginForm />
      </Card>
    </main>
  );
};

export default LoginPage;
