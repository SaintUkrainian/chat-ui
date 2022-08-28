import React from "react";
import styles from "./css/Message.module.css";

const Message = (props) => {
  return (
    <React.Fragment>
      {props.isMyMessage ? (
        <div className={styles.messageContainerMe}>
          <p className={styles.myMessage}>{props.text}</p>
          <p className={styles.me}>{props.fromUser.substring(0,1)}</p>
        </div>
      ) : (
        <div className={styles.messageContainerOtherUser}>
          <p className={styles.otherUser}>{props.fromUser.substring(0,1)}</p>
          <p className={styles.message}>{props.text}</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Message;
