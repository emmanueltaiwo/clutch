export interface ContributorsType {
  email: string;
  name: string;
  type: string;
  contributions: number;
}

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
}

export interface LoginResponse {
  message: string;
}
