/*
  Steps for State Management
  Step 1: Subit Action
  Step 2: Handle action in it's Reducer
  Step 3: Register here -> In Reducer
*/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});
