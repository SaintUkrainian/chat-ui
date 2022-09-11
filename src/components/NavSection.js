import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/redux-store";
import AddContactForm from "./AddContactForm";

import styles from "./css/ChatGroup.module.css";
import navStyles from "./css/NavSection.module.css";

const NavSection = (props) => {
  const dispatch = useDispatch();
  const stompClient = props.stompClient;
  const [connected, setConnected] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const [privateChats, setPrivateChats] = useState([]);
  const [isPopulatedWithChats, setIsPopulatedWithChats] = useState(false);
  const username = useSelector((state) => state.auth.username);

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
    stompClient.subscribe("/topic/new-chat/" + userId, onNewChatReceived, {});
  };

  const onNewChatReceived = (payload) => {
    console.log(payload.body);
    const chatData = JSON.parse(payload.body);
    const newPrivateChat = {
      ...chatData,
      stompClient: stompClient.current,
    };
    setPrivateChats((prevState) => prevState.concat(newPrivateChat));
  };

  const onConnectionFailed = (error) => {
    console.log(error);
  };

  if (!connected) {
    stompClient.connect({}, onConnected, onConnectionFailed);
    setConnected(true);
  }

  return (
    <div className={navStyles.navSection}>
      <div className={navStyles.navHeader}>
        <div style={{display: "flex"}}>
          <h2 style={{margin: "1rem"}}>Welcome, {username}</h2>
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
      <ul className={styles.contacts}>
        {privateChats.length === 0 ? (
          <li style={{ color: "black", weight: "1000" }}>
            You don't have any chats yet
          </li>
        ) : (
          privateChats.map((c) => (
            <li key={c.chatId}>
              <button
                className={styles.contact}
                onClick={() => props.setCurrentChat(c)}
              >
                {c.chatWithUser.username}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NavSection;
