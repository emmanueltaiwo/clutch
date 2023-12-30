import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import sidebarReducer from "./features/sidebar/sidebarSlice";
import feedReducer from "./features/feed/feedSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      sidebar: sidebarReducer,
      feed: feedReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
