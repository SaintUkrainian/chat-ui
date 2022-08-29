import React, { useState } from "react";
import { useSelector } from "react-redux";

import commonStyles from "./css/CommonStyles.module.css";

const AddContactForm = (props) => {
  const [receiverId, setReceiverId] = useState("");
  const userId = useSelector((state) => state.auth.userId);

  const createPrivateChat = (event) => {
    event.preventDefault();
    if (receiverId === "") {
      return;
    }
    const newChatData = {
      fromUserId: userId,
      toUserId: receiverId,
    };
    props.stompClient.send(
      "/websocket-new-chat",
      {},
      JSON.stringify(newChatData)
    );
    setReceiverId("");
  };

  return (
    <form onSubmit={(event) => createPrivateChat(event)}>
      <input
        type={"text"}
        placeholder={"Add a user by username"}
        onChange={(event) => setReceiverId(event.target.value)}
      ></input>
      <input type={"submit"} value={"Add a contact"} className={commonStyles.actionButton}></input>
    </form>
  );
};

export default AddContactForm;
