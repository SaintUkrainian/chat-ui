import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, username: "", email: "", userId: null },
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
    },
    unauthenticate(state, action) {
      state.isAuthenticated = false;
      state.username = "";
      state.email = "";
      state.userId = null;
    }
  },
});

const currentChatSlice = createSlice({
  name: "currentChat",
  initialState: {
    stompClient: null,
    chatData: null,
    chatWith: null,
  },
  reducers: {
    setCurrentChat(state, action) {
      state.stompClient = action.payload.stompClient;
      state.chatData = action.payload.chatData;
      state.chatWith = action.payload.chatWith;
    },
  },
});

const store = configureStore({
  reducer: { auth: authSlice.reducer, currentChat: currentChatSlice.reducer },
});

export const authActions = authSlice.actions;

export const currentChatActions = currentChatSlice.actions;

export default store;
