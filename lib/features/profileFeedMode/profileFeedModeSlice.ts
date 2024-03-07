import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileFeedMode: "posts",
};

export const profileFeedModeSlice = createSlice({
  name: "profileFeedMode",
  initialState,
  reducers: {
    setFeedMode: (state, action) => {
      state.profileFeedMode = action.payload;
    },
  },
});

export const { setFeedMode } = profileFeedModeSlice.actions;
export default profileFeedModeSlice.reducer;
