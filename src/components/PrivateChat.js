import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InputMessageForm from "./InputMessageForm";
import styles from "./css/PrivateChat.module.css"

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
        {privateMessages.map((m) => {
          if (m.fromUser === userId) {
            return (
              <p key={m.timestamp} className={styles.myMessage}>
                {m.value}
              </p>
            );
          } else {
            return (
              <p key={m.timestamp} className={styles.message}>
                {m.value}
              </p>
            );
          }
        })}
      </div>
      <InputMessageForm
        stompClient={stompClient}
        path={"/websocket-private-chat/" + chatData.chatId}
      />
    </div>
  );
};

export default PrivateChat;
