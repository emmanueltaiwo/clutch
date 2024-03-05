import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditPost: false,
};

export const editPostSlice = createSlice({
  name: "editPost",
  initialState,
  reducers: {
    editPost: (state) => {
      state.isEditPost = true;
    },
    closeEditPost: (state) => {
      state.isEditPost = false;
    },
  },
});

export const { editPost, closeEditPost } = editPostSlice.actions;
export default editPostSlice.reducer;
