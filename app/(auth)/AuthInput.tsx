import React, { FC } from "react";

interface AuthInputProps {
  type: string;
  placeholder?: string;
  name: string;
}

const AuthInput: FC<AuthInputProps> = ({ type, placeholder, name }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      required
      className="w-full p-4 rounded-[10px] border-2 border-[rgb(43,43,125)] text-white placeholder:text-white font-[400] text-[14px] bg-transparent outline-none"
    />
  );
};

export default AuthInput;
