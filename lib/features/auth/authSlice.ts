import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

const initialState: User = {
  email: "",
  fullName: "",
  phoneNumber: "",
  dateOfBirth: "",
  profilePic: "",
  gender: "",
  country: "",
  interests: [""],
  username: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { addUser } = authSlice.actions;
export default authSlice.reducer;
