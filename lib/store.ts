import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import sidebarReducer from "./features/sidebar/sidebarSlice";
import editPostReducer from "./features/editPost/editPostSlice";
import editCommentReducer from "./features/editComment/editCommentSlice";
import profileFeedModeReducer from "./features/profileFeedMode/profileFeedModeSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      sidebar: sidebarReducer,
      editPost: editPostReducer,
      editComment: editCommentReducer,
      profileFeedMode: profileFeedModeReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
