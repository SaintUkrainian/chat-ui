import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import styles from "./css/AddContactForm.module.css";
import userStyles from "./css/User.module.css";
import User from "./User";

const AddContactForm = (props) => {
  const [searchString, setSearchString] = useState("");
  const [users, setUsers] = useState(null);
  const [isReadyToFind, setIsReadyToFind] = useState(false);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    let timeout = null;
    if (isReadyToFind) {
      timeout = setTimeout(() => {
        axios
          .post("http://localhost:8080/users", {
            searchString: searchString,
          })
          .then((response) => {
            console.log(response.data);
            setUsers(response.data);
            setIsReadyToFind(false);
          });
      }, 500);
    } else {
      if (searchString === "") {
        setIsReadyToFind(false);
        setUsers(null);
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isReadyToFind, searchString]);

  const createPrivateChat = (user) => {
    const newChatData = {
      fromUserId: userId,
      toUserId: user.userId,
    };
    props.stompClient.send(
      "/websocket-new-chat",
      {},
      JSON.stringify(newChatData)
    );
    setSearchString("");
  };

  const populateUsers = () => {
    if (users.length === 0) {
      return (
        <h2
          className={userStyles.user}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop:"0"
          }}
        >
          No users found
        </h2>
      );
    } else {
      return users.map((u) => (
        <User key={u.userId} user={u} createPrivateChat={createPrivateChat} />
      ));
    }
  };

  return (
    <div className={styles.addContactSection}>
      <input
        type={"text"}
        placeholder={"Find someone"}
        onChange={(event) => {
          setIsReadyToFind(true);
          setSearchString(event.target.value);
        }}
      ></input>
      {users === null ? null : (
        <div className={styles.users}>{populateUsers()}</div>
      )}
    </div>
  );
};

export default AddContactForm;
