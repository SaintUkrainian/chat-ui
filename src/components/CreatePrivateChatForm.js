import React, { useState } from "react";
import { useSelector } from "react-redux";

const CreatePrivateChatForm = (props) => {
  const [receiverId, setReceiverId] = useState("");
  const userId = useSelector((state) => state.auth.userId);

  const createPrivateChat = (event) => {
    event.preventDefault();
    const chatId = Date.now();
    const newChatData = {
      chatId: chatId,
      fromUser: userId,
      toUser: receiverId,
    };
    props.stompClient.send(
      "/websocket-new-chat",
      {},
      JSON.stringify(newChatData)
    );
    props.setPrivateChats((prevState) =>
      prevState.concat({
        stompClient: props.stompClient,
        chatData: newChatData,
        chatWith: receiverId,
      })
    );
  };

  return (
    <form onSubmit={(event) => createPrivateChat(event)}>
      <input
        type={"text"}
        placeholder={"Add a user by username"}
        onChange={(event) => setReceiverId(event.target.value)}
      ></input>
      <input type={"submit"} value={"Create a chat"}></input>
    </form>
  );
};

export default CreatePrivateChatForm;
