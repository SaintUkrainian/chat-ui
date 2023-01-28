import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "./css/ChatGroup.module.css";
import { createUserImage } from "./ImageUtils";

const ChatLink = (props) => {
  const CHAT_MESSAGES_BASE_URL = "http://localhost:8080/chat-messages/";
  const [isLatestMessageFetched, setIsLatestMessageFetched] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const notificationStompClient = props.notificationStompClient;
  const chat = props.chat;
  const [latestMessage, setLatestMessage] = useState(null);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(null);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (!isLatestMessageFetched) {
      axios
        .get(CHAT_MESSAGES_BASE_URL + chat.chatId + "/latest")
        .then((response) => {
          setLatestMessage(response.data.value);
          setIsLatestMessageFetched(true);
        })
        .catch((error) => console.log(error));
      axios
        .get(CHAT_MESSAGES_BASE_URL + chat.chatId + "/unseen")
        .then((response) => {
          console.log(response);
          setUnseenMessagesCount(response.data);
        })
        .catch((error) => console.log(error));
    }
  });

  const onNotificationReceived = (payload) => {
    const notification = JSON.parse(payload.body);
    console.log(notification);
    setLatestMessage(notification.latestMessage);
    if (notification.fromUserId !== userId) {
      setUnseenMessagesCount(notification.unseenMessagesCount);
    }
  };

  const onMessagesSeenEventReceieved = (payload) => {
    console.log(payload);
    setUnseenMessagesCount(0);
  };

  if (!isSubscribed) {
    notificationStompClient.subscribe(
      `/queue/notifications/${chat.chatId}`,
      onNotificationReceived,
      {}
    );
    notificationStompClient.subscribe(
      `/queue/notifications/${chat.chatId}/messages-seen/${userId}`,
      onMessagesSeenEventReceieved,
      {}
    );
    setIsSubscribed(true);
  }

  let latestMessageStyled;
  let latestMessageSubstring =
    latestMessage && latestMessage.length > 20
      ? latestMessage.substring(0, 20) + "..."
      : latestMessage;

  let hasNewMessages = unseenMessagesCount !== null && unseenMessagesCount > 0;

  if (hasNewMessages) {
    latestMessageStyled = (
      <p style={{ margin: "0", fontWeight: "bold", color: "darkblue" }}>
        {latestMessageSubstring}
      </p>
    );
  } else {
    latestMessageStyled = (
      <p style={{ margin: "0", fontWeight: "200" }}>{latestMessageSubstring}</p>
    );
  }

  let badgeToDisplay = createUserImage(chat.chatWithUser);

  return (
    <li
      onClick={() => {
        props.setCurrentChat(chat);
      }}
      className={styles.contact}
    >
      {badgeToDisplay}
      {hasNewMessages ? (
        <span className={styles.badgeNotifications}>{unseenMessagesCount}</span>
      ) : null}
      <div className={styles.container}>
        <h3 style={{ margin: "0", marginBottom: "2pt", fontWeight: "900" }}>
          {chat.chatWithUser.firstName} {chat.chatWithUser.lastName}{" "}
        </h3>
        {latestMessageStyled}
      </div>
    </li>
  );
};

export default ChatLink;
