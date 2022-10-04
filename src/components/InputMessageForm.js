import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./css/InputMessageForm.module.css";

const InputMessageForm = (props) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingEventSent, setIsTypingEventSent] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const chatData = props.chatData;
  const stompClient = props.stompClient;

  useEffect(() => {
    let timeout = null;
    if (isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(false);
      }, 500);
    } else if (!isTyping && isTypingEventSent) {
      timeout = setTimeout(() => {
        stompClient.send(
          `/topic/private-chat/${chatData.chatId}/typing/${userId}`,
          {},
          JSON.stringify({ eventValue: "STOPPED_TYPING" })
        );
        setIsTypingEventSent(false);
      }, 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input === "") {
      return;
    }
    stompClient.send(
      props.path,
      {},
      JSON.stringify({
        fromUser: chatData.user,
        value: input,
        chatId: chatData.chatId,
      })
    );
    setInput("");
  };

  const handleTyping = (event) => {
    if (!isTypingEventSent) {
      stompClient.send(
        `/topic/private-chat/${chatData.chatId}/typing/${userId}`,
        {},
        JSON.stringify({ eventValue: "STARTED_TYPING" })
      );
      setIsTypingEventSent(true);
    }
    setIsTyping(true);
    setInput(event.target.value);
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.input}>
      <textarea
        type={"text"}
        placeholder={"Your message..."}
        onChange={(event) => handleTyping(event)}
        value={input}
        style={{
          fontSize: "16px",
          margin: "1rem",
          maxWidth: "40rem",
          maxHeight: "10rem",
        }}
      ></textarea>
      <input type={"submit"} value="Send" className={styles.btn}></input>
    </form>
  );
};

export default InputMessageForm;
