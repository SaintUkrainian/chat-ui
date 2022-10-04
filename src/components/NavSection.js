import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/redux-store";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AddContactForm from "./AddContactForm";
import ChatLink from "./ChatLink";

import styles from "./css/ChatGroup.module.css";
import navStyles from "./css/NavSection.module.css";

const NavSection = (props) => {
  const notificationSockJs = useRef(
    new SockJS(`http://localhost:8082/chat-notifications`)
  );
  const notificationStompClient = useRef(over(notificationSockJs.current));

  const dispatch = useDispatch();
  const [parent] = useAutoAnimate();
  const stompClient = props.stompClient;
  const [notificationConnected, setNotificationsConnected] = useState(false);
  const [connected, setConnected] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const [privateChats, setPrivateChats] = useState([]);
  const [isPopulatedWithChats, setIsPopulatedWithChats] = useState(false);
  const firstName = useSelector((state) => state.auth.firstName);
  const lastName = useSelector((state) => state.auth.lastName);

  useEffect(() => {
    if (!isPopulatedWithChats) {
      console.log("Fetching chats by userId = " + userId);
      axios.get("http://localhost:8080/chats/" + userId).then((response) => {
        console.log(response.data);
        let chats = [];
        response.data.forEach((element) => {
          chats.push({ ...element, stompClient: stompClient });
        });
        setPrivateChats(chats);
        setIsPopulatedWithChats(true);
      });
    }
  });

  const onConnected = () => {
    console.log("Successfuly connected!");
    stompClient.subscribe("/topic/new-chat/" + userId, onNewChatReceived, {});
  };

  const onNewChatReceived = (payload) => {
    console.log(payload.body);
    const chatData = JSON.parse(payload.body);
    const newPrivateChat = {
      ...chatData,
      stompClient: stompClient,
    };
    setPrivateChats((prevState) => prevState.concat(newPrivateChat));
  };

  const onConnectionFailed = (error) => {
    console.log(error);
  };

  if (!connected) {
    stompClient.connect({}, onConnected, onConnectionFailed);
    notificationStompClient.current.connect(
      {},
      () => setNotificationsConnected(true),
      (error) => {
        console.log(error);
      }
    );
    setConnected(true);
  }

  return (
    <div className={navStyles.navSection}>
      <div className={navStyles.navHeader}>
        <div style={{ display: "flex" }}>
          <h2 style={{ margin: "0.7rem", padding: "0" }}>
            {firstName} {lastName}
          </h2>
          <button
            onClick={() => dispatch(authActions.unauthenticate())}
            className={styles.logout}
          >
            Logout
          </button>
        </div>
        <AddContactForm
          setPrivateChats={setPrivateChats}
          stompClient={stompClient}
        />
      </div>
      <h4 className={navStyles.chatsHeader}>Chats</h4>
      <ul className={styles.contacts} ref={parent}>
        {privateChats.length === 0 ? (
          <li style={{ color: "white", weight: "1000" }}>
            You don't have any chats yet
          </li>
        ) : notificationConnected ? (
          privateChats.map((c) => (
            <ChatLink
              key={c.chatId}
              setCurrentChat={props.setCurrentChat}
              chat={c}
              notificationStompClient={notificationStompClient.current}
            />
          ))
        ) : (
          <li style={{ color: "white", weight: "1000" }}>Connection failed</li>
        )}
      </ul>
    </div>
  );
};

export default NavSection;
