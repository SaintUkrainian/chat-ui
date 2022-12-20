import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    username: "",
    email: "",
    userId: null,
    firstName: "",
    lastName: "",
  },
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
    unauthenticate(state, action) {
      state.isAuthenticated = false;
      state.username = "";
      state.email = "";
      state.userId = null;
      state.firstName = "";
      state.lastName = "";
      localStorage.clear();
    },
  },
});

const store = configureStore({
  reducer: { auth: authSlice.reducer },
});

export const authActions = authSlice.actions;

export default store;
