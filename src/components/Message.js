import React from "react";
import styles from "./css/Message.module.css";

const Message = (props) => {
  return (
    <React.Fragment>
      {props.isMyMessage ? (
        <div className={styles.messageContainerMe}>
          <div className={styles.messageValueMe}>
            <p className={styles.myMessage}>{props.text}</p>
            <p className={styles.timestamp}>{props.sendTimestamp}</p>
          </div>
          <div>
            <p className={styles.me}>{props.fromUser.substring(0, 1)}</p>
          </div>
        </div>
      ) : (
        <div className={styles.messageContainerOtherUser}>
          <div>
            <p className={styles.otherUser}>{props.fromUser.substring(0, 1)}</p>
          </div>
          <div className={styles.messageValueOtherUser}>
            <p className={styles.message}>{props.text}</p>
            <p className={styles.timestamp}>{props.sendTimestamp}</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Message;
