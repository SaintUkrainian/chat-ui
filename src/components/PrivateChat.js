import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import InputMessageForm from "./InputMessageForm";
import styles from "./css/PrivateChat.module.css";
import Message from "./Message";
import Typing from "./Typing";

const PrivateChat = (props) => {
  const [parent] = useAutoAnimate();
  const [privateMessages, setPrivateMessages] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMessagesFetched, setIsMessagesFetched] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompanionOnline, setIsCompanionOnline] = useState(null);
  const [hasCompanionConfirmed, setHasCompanionConfirmed] = useState(false);
  const [chatSubsrcriptions, setChatSubscriptions] = useState([]);
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
          const chatMsgs = response.data;
          const unseenMsgsIdsToMe = chatMsgs
            .filter((msg) => msg.fromUser.userId !== userId && !msg.isSeen)
            .map((m) => m.messageId);
          setPrivateMessages(chatMsgs);
          setIsMessagesFetched(true);
          stompClient.send(
            `/websocket-private-chat/messages-seen`,
            {},
            JSON.stringify({ chatId: chatData.chatId, userId: userId })
          );
          stompClient.send(
            `/topic/private-chat/${chatData.chatId}/companion-online/${userId}`,
            {},
            JSON.stringify({ value: "COMPANION_ONLINE" })
          );
          if (unseenMsgsIdsToMe.length > 0) {
            stompClient.send(
              `/topic/private-chat/${chatData.chatId}/seen-messages/${chatData.chatWithUser.userId}`,
              {},
              JSON.stringify({ messagesIds: unseenMsgsIdsToMe })
            );
          }
        });
    }
    return () => {
      stompClient.send(
        `/topic/private-chat/${chatData.chatId}/companion-online/${userId}`,
        {},
        JSON.stringify({ value: "COMPANION_OFFLINE" })
      );
      chatSubsrcriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [chatData.chatId]);

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
  };

  const onCompanionOnlineEventReceived = (payload) => {
    const event = JSON.parse(payload.body);
    console.log(event);
    if (event.value === "COMPANION_ONLINE") {
      setIsCompanionOnline(true);
    } else if (event.value === "COMPANION_OFFLINE") {
      setIsCompanionOnline(false);
      setHasCompanionConfirmed(false);
    }
    stompClient.send(
      `/topic/private-chat/${chatData.chatId}/confirmation/${chatData.chatWithUser.userId}`,
      {},
      JSON.stringify({ value: "MESSAGE_RECEIVED" })
    );
  };

  const onConfirmationReceived = (payload) => {
    const event = JSON.parse(payload.body);
    console.log(event);
    if (event.value === "MESSAGE_RECEIVED") {
      setHasCompanionConfirmed(true);
    }
  };

  const onMessagesSeenReceived = (payload) => {
    const messagesIds = JSON.parse(payload.body).messagesIds;
    setPrivateMessages((prevState) =>
      prevState.map((msg) => {
        if (messagesIds.includes(msg.messageId)) {
          msg = { ...msg, isSeen: true };
          console.log(msg);
        }
        return msg;
      })
    );
  };

  if (!isSubscribed) {
    const subscriptions = [];

    subscriptions.push(
      stompClient.subscribe(
        "/topic/private-chat/" + chatData.chatId,
        onPrivateMessageReceived,
        {}
      ),
      stompClient.subscribe(
        `/topic/private-chat/${chatData.chatId}/edit-message`,
        onEditedMessageReceived,
        {}
      ),
      stompClient.subscribe(
        `/topic/private-chat/${chatData.chatId}/delete-message`,
        onDeleteMessageReceived,
        {}
      ),
      stompClient.subscribe(
        `/topic/private-chat/${chatData.chatId}/seen-messages/${userId}`,
        onMessagesSeenReceived,
        {}
      ),
      stompClient.subscribe(
        `/topic/private-chat/${chatData.chatId}/typing/${chatData.chatWithUser.userId}`,
        onTypingEventReceived,
        {}
      ),
      stompClient.subscribe(
        `/topic/private-chat/${chatData.chatId}/companion-online/${chatData.chatWithUser.userId}`,
        onCompanionOnlineEventReceived,
        {}
      ),
      stompClient.subscribe(
        `/topic/private-chat/${chatData.chatId}/confirmation/${userId}`,
        onConfirmationReceived,
        {}
      )
    );

    setChatSubscriptions(subscriptions);

    setIsSubscribed(true);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    let interval = null;
    if (!isCompanionOnline || !hasCompanionConfirmed) {
      interval = setInterval(() => {
        stompClient.send(
          `/topic/private-chat/${chatData.chatId}/companion-online/${userId}`,
          {},
          JSON.stringify({ value: "COMPANION_ONLINE" })
        );
      }, 1500);
    } else {
      interval = null;
    }
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className={styles.chat}>
      <h4>
        Chat with {chatData.chatWithUser.firstName}{" "}
        {chatData.chatWithUser.lastName}
        {isCompanionOnline ? (
          <span style={{ color: "lightgreen" }}> (online in chat)</span>
        ) : null}
      </h4>
      <div className={styles.messages} ref={parent}>
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
        <div style={{ display: "flex", justifyContent: "left" }}>
          {isTyping ? <Typing /> : null}
        </div>
      </div>
      <InputMessageForm
        stompClient={stompClient}
        path={"/websocket-private-chat"}
        chatData={chatData}
        isCompanionOnline={isCompanionOnline}
      />
    </div>
  );
};

export default PrivateChat;
