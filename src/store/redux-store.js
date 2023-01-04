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
    userImage: null,
  },
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.userImage = action.payload.userImage;
    },
    unauthenticate(state, action) {
      state.isAuthenticated = false;
      state.username = "";
      state.email = "";
      state.userId = null;
      state.firstName = "";
      state.lastName = "";
      state.userImage = null;
      localStorage.clear();
    },
  },
});

const store = configureStore({
  reducer: { auth: authSlice.reducer },
});

export const authActions = authSlice.actions;

export default store;
