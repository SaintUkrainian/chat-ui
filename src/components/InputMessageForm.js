import React, { useState } from "react";
import styles from "./css/InputMessageForm.module.css";

const InputMessageForm = (props) => {
  const [input, setInput] = useState("");
  const chatData = props.chatData;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input === "") {
      return;
    }
    props.stompClient.send(
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

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.input}>
      <input
        type={"text"}
        placeholder={"Your message..."}
        onChange={(event) => setInput(event.target.value)}
        value={input}
        style={{ fontSize: "16px" }}
      ></input>
      <input type={"submit"} value="Send" className={styles.button}></input>
    </form>
  );
};

export default InputMessageForm;
