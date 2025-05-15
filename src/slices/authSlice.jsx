import { createSlice } from "@reduxjs/toolkit";

const authSl = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    message: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setUserInfo, clearUser, setLoading, setMessage } = authSl.actions;
export const authSlice = authSl.reducer;