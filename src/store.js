
import { configureStore } from "@reduxjs/toolkit";
import {fileSlice} from "./slices/fileSlice"
import { authSlice } from "./slices/authSlice";
const store = configureStore({
  reducer: {
    files: fileSlice,
    auth: authSlice,
  },
});

export default store;
