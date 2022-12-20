import React, { useState } from "react";
import styles from "./css/Message.module.css";

const Message = (props) => {
  const message = props.message;
  const [editingMode, setEditingMode] = useState(false);
  const [newMessageValue, setNewMessageValue] = useState(message.value);

  let elementToDisplay = null;

  const startEditing = () => {
    setEditingMode(true);
  };

  const discardChanges = () => {
    setNewMessageValue(message.value);
    setEditingMode(false);
  };

  const endEditing = (event) => {
    event.preventDefault();
    setEditingMode(false);
    if (newMessageValue === message.value) {
      return;
    } else {
      props.editMessage({ ...message, value: newMessageValue });
    }
  };

  const deleteMessage = () => {
    const hasToBeDeleted = window.confirm("Are you sure?");
    if (hasToBeDeleted) {
      props.deleteMessage(message);
    }
  };

  if (!editingMode) {
    elementToDisplay = props.isMyMessage ? (
      <div className={styles.messageContainerMe} onClick={() => startEditing()}>
        <div className={styles.messageValueMe}>
          <p className={styles.myMessage}>{message.value}</p>
          <div className={styles.msgMetainfo}>
            <p className={styles.timestamp}>
              {new Date(message.sendTimestamp).toLocaleString()}
            </p>
            {message.isEdited ? <p className={styles.edited}>Edited</p> : null}
            {message.isSeen ? <p className={styles.edited}>Seen</p> : null}
          </div>
        </div>
        <div>
          <p className={styles.me}>
            {message.fromUser.firstName.substring(0, 1)}
          </p>
        </div>
      </div>
    ) : (
      <div className={styles.messageContainerOtherUser}>
        <div>
          <p className={styles.otherUser}>
            {message.fromUser.firstName.substring(0, 1)}
          </p>
        </div>
        <div className={styles.messageValueOtherUser}>
          <p className={styles.message}>{message.value}</p>
          <div className={styles.msgMetainfo}>
            {message.isEdited ? <p className={styles.edited}>Edited</p> : null}
            <p className={styles.timestamp}>
              {new Date(message.sendTimestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    elementToDisplay = (
      <div className={styles.messageContainerMe} onClick={() => startEditing()}>
        <div className={styles.messageValueMe}>
          <form
            onSubmit={(event) => endEditing(event)}
            className={styles.editForm}
          >
            <textarea
              className={styles.editArea}
              value={newMessageValue}
              onChange={(event) => setNewMessageValue(event.target.value)}
            />
            <div>
              <input
                type={"submit"}
                value={"Edit"}
                style={{ cursor: "pointer" }}
              />
              <button onClick={() => discardChanges()}>Cancel</button>
              <button
                value={"Delete"}
                className="danger"
                onClick={() => deleteMessage()}
              >
                Delete
              </button>
            </div>
          </form>
          <p className={styles.timestamp}>
            {new Date(message.sendTimestamp).toLocaleString()}
          </p>
        </div>
        <div>
          <p className={styles.me}>
            {message.fromUser.firstName.substring(0, 1)}
          </p>
        </div>
      </div>
    );
  }

  return <React.Fragment>{elementToDisplay}</React.Fragment>;
};

export default Message;
