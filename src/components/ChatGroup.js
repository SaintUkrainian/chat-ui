import React, { useRef, useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { over } from "stompjs";
import PrivateChat from "./PrivateChat";
import CreatePrivateChatForm from "./CreatePrivateChatForm";
import styles from "./css/ChatGroup.module.css";

const ChatGroup = () => {
  const userId = useSelector((state) => state.auth.userId);
  const sockJs = useRef(
    new SockJS(`http://localhost:8080/chat?userId=${userId}`)
  );
  const stompClient = useRef(over(sockJs.current));

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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ margin: "10px" }}>
        <h2>Welcome, {userId}</h2>
        <CreatePrivateChatForm
          setPrivateChats={setPrivateChats}
          stompClient={stompClient.current}
        />
        <h4>Contact list</h4>
        <ul className={styles.contacts}>
          {privateChats.map((c) => (
            <li key={c.chatData.chatId}>
              <button className={styles.contact} onClick={() => setCurrentChat(c)}>{c.chatWith}</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {currentChat === null ? null : (
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
