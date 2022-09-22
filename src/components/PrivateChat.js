import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import InputMessageForm from "./InputMessageForm";
import styles from "./css/PrivateChat.module.css";
import Message from "./Message";
import Typing from "./Typing";

const PrivateChat = (props) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMessagesFetched, setIsMessagesFetched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatData = props.chatData;
  const stompClient = chatData.stompClient;
  const userId = useSelector((state) => state.auth.userId);
  const messagesEndRef = React.createRef();

  useEffect(() => {
    if (!isMessagesFetched) {
      console.log("Fetching chat messages with chat id = " + chatData.chatId);
      axios
        .get("http://localhost:8080/chat-messages/" + chatData.chatId)
        .then((response) => {
          console.log(response.data);
          setPrivateMessages(response.data);
          setIsMessagesFetched(true);
        });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const onPrivateMessageReceived = (payload) => {
    setPrivateMessages((prevState) =>
      prevState.concat(JSON.parse(payload.body))
    );
  };

  const onEditedMessageReceived = (payload) => {
    const editedMessage = JSON.parse(payload.body);
    setPrivateMessages((prevState) =>
      prevState.map((m) => {
        if (m.messageId === editedMessage.messageId) {
          return editedMessage;
        }
        return m;
      })
    );
  };

  const onDeleteMessageReceived = (payload) => {
    const messageToDelete = JSON.parse(payload.body);
    setPrivateMessages((prevState) =>
      prevState.filter((m) => m.messageId !== messageToDelete.messageId)
    );
  };

  const editMessage = (editedMessage) => {
    stompClient.send(
      `/websocket-private-chat/edit-message`,
      {},
      JSON.stringify(editedMessage)
    );
  };

  const deleteMessage = (messageToDelete) => {
    stompClient.send(
      "/websocket-private-chat/delete-message",
      {},
      JSON.stringify(messageToDelete)
    );
  };

  const onTypingEventReceived = (payload) => {
    const typingEvent = JSON.parse(payload.body);
    if (typingEvent.eventValue === "STARTED_TYPING") {
      setIsTyping(true);
    } else if (typingEvent.eventValue === "STOPPED_TYPING") {
      setIsTyping(false);
    }
  }

  if (!isSubscribed) {
    stompClient.subscribe(
      "/topic/private-chat/" + chatData.chatId,
      onPrivateMessageReceived,
      {}
    );
    stompClient.subscribe(
      `/topic/private-chat/${chatData.chatId}/edit-message`,
      onEditedMessageReceived,
      {}
    );
    stompClient.subscribe(
      `/topic/private-chat/${chatData.chatId}/delete-message`,
      onDeleteMessageReceived,
      {}
    );
    stompClient.subscribe(
      `/topic/private-chat/${chatData.chatId}/typing/${chatData.chatWithUser.userId}`,
      onTypingEventReceived,
      {}
    );
    setIsSubscribed(true);
  }

  return (
    <div className={styles.chat}>
      <h4>Chat with {chatData.chatWithUser.username}</h4>
      <div className={styles.messages}>
        {privateMessages.map((m) => (
          <Message
            key={m.sendTimestamp}
            message={m}
            isMyMessage={m.fromUser.userId === userId}
            editMessage={editMessage}
            deleteMessage={deleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
        {isTyping ? (
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Typing />
          </div>
        ) : null}
      </div>
      <InputMessageForm
        stompClient={stompClient}
        path={"/websocket-private-chat"}
        chatData={chatData}
      />
    </div>
  );
};

export default PrivateChat;
