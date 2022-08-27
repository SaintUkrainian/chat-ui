import React, { useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { over } from "stompjs";
import PrivateChat from "./PrivateChat";
import CreatePrivateChatForm from "./CreatePrivateChatForm";

const ChatGroup = () => {
  const userId = useSelector((state) => state.auth.userId);
  const sockJs = useRef(
    new SockJS(`http://localhost:8080/chat?userId=${userId}`)
  );
  const stompClient = useRef(over(sockJs.current));

  const [connected, setConnected] = useState(false);
  const [privateChats, setPrivateChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

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
      </div>
      <div style={{ margin: "10px" }}>
        {privateChats.map((c) => (
          <PrivateChat
            key={c.chatData.chatId}
            stompClient={c.stompClient}
            chatData={c.chatData}
            chatWith={c.chatWith}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatGroup;
