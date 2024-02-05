import { User } from "@/types";

export interface Login {
  email: string;
  password: string;
}

export interface Signup {
  email: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  interests: string[];
  termsAndConditions: string;
  password: string;
  hasFullAccess?: boolean;
  status?: boolean;
  profilePic?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  userId?: string;
}
