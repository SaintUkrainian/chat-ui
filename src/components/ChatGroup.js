import React, { useRef, useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { useSelector, useDispatch } from "react-redux";
import { over } from "stompjs";
import PrivateChat from "./PrivateChat";
import CreatePrivateChatForm from "./AddContactForm";
import styles from "./css/ChatGroup.module.css";
import { authActions } from "../store/redux-store";

const ChatGroup = () => {
  const userId = useSelector((state) => state.auth.userId);
  const sockJs = useRef(
    new SockJS(`http://localhost:8080/chat?userId=${userId}`)
  );
  const stompClient = useRef(over(sockJs.current));
  const dispatch = useDispatch();

  const [connected, setConnected] = useState(false);
  const [privateChats, setPrivateChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    console.log("Fetching chats by userId = " + userId);
  });

  const onConnected = () => {
    stompClient.current.subscribe(
      "/topic/new-chat/" + userId,
      onNewChatReceived,
      {}
    );
  };

  const onNewChatReceived = (payload) => {
    const chatData = JSON.parse(payload.body);
    const newPrivateChat = {
      stompClient: stompClient.current,
      chatData: chatData,
      chatWith: chatData.fromUser,
    };
    setPrivateChats((prevState) => prevState.concat(newPrivateChat));
  };

  const onConnectionFailed = (error) => {
    console.log(error);
  };

  if (!connected) {
    stompClient.current.connect({}, onConnected, onConnectionFailed);
    setConnected(true);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "10px",
        width: "100%",
      }}
    >
      <div style={{ margin: "10px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Welcome, {userId}</h2>
          <button
            onClick={() => dispatch(authActions.unauthenticate())}
            className={styles.logout}
          >
            Logout
          </button>
        </div>
        <CreatePrivateChatForm
          setPrivateChats={setPrivateChats}
          stompClient={stompClient.current}
        />
        <h4 style={{ margin: "10px" }}>Contact list</h4>
        <ul className={styles.contacts}>
          {privateChats.length == 0 ? (
            <li style={{ color: "black", weight: "1000" }}>
              You don't have any contacts yet
            </li>
          ) : (
            privateChats.map((c) => (
              <li key={c.chatData.chatId}>
                <button
                  className={styles.contact}
                  onClick={() => setCurrentChat(c)}
                >
                  {c.chatWith}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "right",
        }}
      >
        {currentChat === null ? (
          <div className={styles.noChat}>
            <h3>No chat selected</h3>
          </div>
        ) : (
          <PrivateChat
            key={currentChat.chatData.chatId}
            stompClient={currentChat.stompClient}
            chatData={currentChat.chatData}
            chatWith={currentChat.chatWith}
          />
        )}
      </div>
    </div>
  );
};

export default ChatGroup;
