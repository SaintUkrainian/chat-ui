import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputMessageForm from "./InputMessageForm";

const PrivateChat = (props) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const stompClient = props.stompClient;
  const chatData = props.chatData;
  const userId = useSelector((state) => state.auth.userId);

  const commonStyle = {
    maxWidth: "250px",
    overflow: "auto",
    marginBottom: "5px",
    marginTop: "1px",
    borderRadius: "10px",
    padding: "5px 10px 5px 10px",
  };

  const styleRight = {
    backgroundColor: "#F5F5DC",
    marginLeft: "auto",
    textAlign: "right",
    ...commonStyle,
  };
  const styleLeft = {
    backgroundColor: "#FFE4C4",
    marginRight: "auto",
    textAlign: "left",
    ...commonStyle,
  };

  const onPrivateMessageReceived = (payload) => {
    setPrivateMessages((prevState) =>
      prevState.concat(JSON.parse(payload.body))
    );
  };

  if (!isSubscribed) {
    stompClient.subscribe(
      "/topic/private-chat/" + chatData.chatId,
      onPrivateMessageReceived,
      {}
    );
    setIsSubscribed(true);
  }

  return (
    <div>
      <h4>Chat with {props.chatWith}</h4>
      <div
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "#BDB76B",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          padding: "10px",
        }}
      >
        {privateMessages.map((m) => {
          if (m.fromUser === userId) {
            return (
              <p key={m.timestamp} style={styleRight}>
                {m.value}
              </p>
            );
          } else {
            return (
              <p key={m.timestamp} style={styleLeft}>
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
