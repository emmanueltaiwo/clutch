import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedMode: "forYou",
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    toggleFeedMode: (state, action) => {
      const targetMode = action.payload;
      state.feedMode =
        state.feedMode === targetMode ? state.feedMode : targetMode;
    },
  },
});

export const { toggleFeedMode } = feedSlice.actions;
export default feedSlice.reducer;
