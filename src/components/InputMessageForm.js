import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./css/InputMessageForm.module.css";

const InputMessageForm = (props) => {
  const [input, setInput] = useState("");
  const userId = useSelector((state) => state.auth.userId);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input === "") {
      return;
    }
    props.stompClient.send(
      props.path,
      {},
      JSON.stringify({ fromUser: userId, value: input })
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
      ></input>
      <input type={"submit"} value="Send" className={styles.button}></input>
    </form>
  );
};

export default InputMessageForm;
