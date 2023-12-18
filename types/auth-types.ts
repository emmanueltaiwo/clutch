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
  interest: string;
  termsAndConditions: string;
  password: string;
  hasFullAccess?: boolean;
  status?: boolean;
}

export interface AuthResponse {
  message: string;
}
