import React from "react";

import styles from "./css/User.module.css"

const User = (props) => {
  const user = props.user;

  return (
    <div onClick={() => props.createPrivateChat(user)} className={styles.user}>
      <h4 style={{margin: "0"}}>{user.username}</h4>
      <p style={{margin: "0", fontWeight:"300"}}>{user.email}</p>
    </div>
  );
};

export default User;
