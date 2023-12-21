export interface User {
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePic: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  interests: string[];
  status?: boolean;
}
