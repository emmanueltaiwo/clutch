import { FC } from "react";
import { Input } from "@/components/ui/input";

interface AuthInputProps {
  type: string;
  placeholder?: string;
  name: string;
}

const AuthInput: FC<AuthInputProps> = ({ type, placeholder, name }) => {
  return (
    <Input
      className="w-full"
      type={type}
      placeholder={placeholder}
      name={name}
      required
    />
  );
};

export default AuthInput;
