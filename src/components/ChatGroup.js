import React, { useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { over } from "stompjs";
import PrivateChat from "./PrivateChat";
import NavSection from "./NavSection";
import styles from "./css/ChatGroup.module.css";

const ChatGroup = () => {
  const userId = useSelector((state) => state.auth.userId);
  const sockJs = useRef(
    new SockJS(`http://localhost:8080/chat?userId=${userId}`)
  );
  const stompClient = useRef(over(sockJs.current));
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around"
      }}
    >
      <NavSection
        stompClient={stompClient.current}
        setCurrentChat={setCurrentChat}
      />
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
          <PrivateChat key={currentChat.chatId} chatData={currentChat} />
        )}
      </div>
    </div>
  );
};

export default ChatGroup;
