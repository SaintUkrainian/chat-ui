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
      <textarea
        type={"text"}
        placeholder={"Your message..."}
        onChange={(event) => setInput(event.target.value)}
        value={input}
        style={{
          fontSize: "16px",
          margin: "1rem",
          maxWidth: "40rem",
          maxHeight: "10rem",
        }}
      ></textarea>
      <input type={"submit"} value="Send" className={styles.button}></input>
    </form>
  );
};

export default InputMessageForm;
