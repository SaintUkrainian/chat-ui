import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

import styles from "./css/ChatGroup.module.css";

const ChatLink = (props) => {
  const [isLatestMessageFetched, setIsLatestMessageFetched] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const notificationStompClient = props.notificationStompClient;
  const chat = props.chat;
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    if (!isLatestMessageFetched) {
      axios
        .get(`http://localhost:8080/chat-messages/${chat.chatId}/latest`)
        .then((response) => {
          setLatestMessage(response.data.value);
          setIsLatestMessageFetched(true);
        })
        .catch((error) => console.log(error));
    }
  });

  const onNotificationReceived = (payload) => {
    const notification = JSON.parse(payload.body);
    console.log(notification);
    setLatestMessage(notification.latestMessage);
  };

  if (!isSubscribed) {
    notificationStompClient.subscribe(
      `/queue/notifications/${chat.chatId}`,
      onNotificationReceived,
      {}
    );
    setIsSubscribed(true);
  }

  return (
    <li onClick={() => props.setCurrentChat(chat)} className={styles.contact}>
      <h4 style={{margin: "0", fontWeight: "900"}}>{chat.chatWithUser.firstName} {chat.chatWithUser.lastName}</h4>
      <p style={{margin: "0", fontWeight:"200"}}>{latestMessage}</p>
    </li>
  );
};

export default ChatLink;
