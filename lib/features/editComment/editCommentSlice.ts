import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditComment: false,
  editUserId: "",
  editCommentId: "",
};

export const editCommentSlice = createSlice({
  name: "editComment",
  initialState,
  reducers: {
    editComment: (state, action) => {
      state.isEditComment = true;
      state.editUserId = action.payload.userId;
      state.editCommentId = action.payload.commentId;
    },
    closeEditComment: (state) => {
      state.isEditComment = false;
      state.editUserId = "";
      state.editCommentId = "";
    },
  },
});

export const { editComment, closeEditComment } = editCommentSlice.actions;
export default editCommentSlice.reducer;
