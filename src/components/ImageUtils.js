import styles from "./css/ChatGroup.module.css";

export function createUserImage(userData) {
  if (userData.userImage != null) {
    const srcString = `data:${userData.userImage.type};base64,${userData.userImage.data}`;
    return <img src={srcString} className={styles.badgeImg}></img>;
  } else {
    return (
      <p className={styles.badge}>
        {userData.firstName
          .substring(0, 1)
          .concat(userData.lastName.substring(0, 1))}
      </p>
    );
  }
}
