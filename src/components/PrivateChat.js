import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import InputMessageForm from "./InputMessageForm";
import styles from "./css/PrivateChat.module.css";
import Message from "./Message";

const PrivateChat = (props) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionObject, setSubscriptionObject] = useState(null);
  const [isMessagesFetched, setIsMessagesFetched] = useState(false);
  const chatData = props.chatData;
  const stompClient = chatData.stompClient;
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (!isMessagesFetched) {
      console.log("Fetching chat messages with chat id = " + chatData.chatId);
      axios.get("http://localhost:8080/chat-messages/" + chatData.chatId).then(response => {
        console.log(response.data);
        setPrivateMessages(response.data);
        setIsMessagesFetched(true);
      });
    }
  });

  const onPrivateMessageReceived = (payload) => {
    setPrivateMessages((prevState) =>
      prevState.concat(JSON.parse(payload.body))
    );
  };

  if (!isSubscribed) {
    const newSubscription = stompClient.subscribe(
      "/topic/private-chat/" + chatData.chatId,
      onPrivateMessageReceived,
      {}
    );
    setIsSubscribed(true);
    setSubscriptionObject(newSubscription);
  }

  return (
    <div className={styles.chat}>
      <h4>Chat with {chatData.chatWithUser.username}</h4>
      <div className={styles.messages}>
        {privateMessages.map((m) => (
          <Message
            key={m.sendTimestamp}
            text={m.value}
            fromUser={m.fromUser.username}
            isMyMessage={m.fromUser.userId === userId}
          />
        ))}
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
