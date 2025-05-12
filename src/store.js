import { configureStore } from "@reduxjs/toolkit";
import { driveSlice } from "./slices/driveSlice";
import { authSlice } from "./slices/authSlice";
const store = configureStore({
  reducer: {
    drive: driveSlice,
    auth: authSlice,
  },
});

export default store;