import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InputMessageForm from "./InputMessageForm";
import styles from "./css/PrivateChat.module.css";
import Message from "./Message";

const PrivateChat = (props) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionObject, setSubscriptionObject] = useState(null);
  const stompClient = props.stompClient;
  const chatData = props.chatData;
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    console.log("Fetching chat messages with chat id = " + chatData.chatId);
    return () => {
      subscriptionObject.unsubscribe();
    };
  }, [chatData.chatId, subscriptionObject]);

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
      <h4>Chat with {props.chatWith}</h4>
      <div className={styles.messages}>
        {privateMessages.map((m) => (
          <Message
            key={m.timestamp}
            text={m.value}
            fromUser={m.fromUser}
            isMyMessage={m.fromUser === userId}
          />
        ))}
      </div>
      <InputMessageForm
        stompClient={stompClient}
        path={"/websocket-private-chat/" + chatData.chatId}
      />
    </div>
  );
};

export default PrivateChat;
