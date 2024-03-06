import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditPost: false,
  editUserId: "",
  editPostId: "",
};

export const editPostSlice = createSlice({
  name: "editPost",
  initialState,
  reducers: {
    editPost: (state, action) => {
      state.isEditPost = true;
      state.editUserId = action.payload.userId;
      state.editPostId = action.payload.postId;
    },
    closeEditPost: (state) => {
      state.isEditPost = false;
      state.editUserId = "";
      state.editPostId = "";
    },
  },
});

export const { editPost, closeEditPost } = editPostSlice.actions;
export default editPostSlice.reducer;
