import React from "react";

import styles from "./css/User.module.css"

const User = (props) => {
  const user = props.user;

  return (
    <div onClick={() => props.createPrivateChat(user)} className={styles.user}>
      <h4 style={{margin: "0"}}>{user.firstName} {user.lastName}</h4>
      <p style={{margin: "0", fontWeight:"300"}}>Username: @{user.username}</p>
      <p style={{margin: "0", fontWeight:"300"}}>Email: {user.email}</p>
    </div>
  );
};

export default User;
