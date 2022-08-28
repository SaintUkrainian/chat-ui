import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, userId: "" },
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
    },
    unauthenticate(state, action) {
      state.isAuthenticated = false;
      state.userId = "";
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
