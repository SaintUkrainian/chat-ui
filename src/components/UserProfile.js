import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserImage } from "./ImageUtils";
import styles from "./css/UserProfile.module.css";
import axios from "axios";
import { authActions } from "../store/redux-store";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const authState = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState(authState.firstName);
  const [lastName, setLastName] = useState(authState.lastName);
  const [newImage, setNewImage] = useState(null);
  const [exceptions, setExceptions] = useState("");
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const dispatch = useDispatch();

  const handleChanges = () => {
    setExceptions("");
    if (newImage && newImage.size > 2 * 1024 * 1024) {
      setExceptions((prevState) =>
        prevState.concat("Image size cannot be greated than 2 MB")
      );
    }
    if (firstName === "" || lastName === "") {
      setExceptions((prevState) => prevState.concat("\nName cannot be empty"));
    }

    if (exceptions === "") {
      let formData = new FormData();

      const hasNewImage = newImage !== null;
      if (hasNewImage) {
        console.log(newImage);
        formData.append("image", newImage);
      }

      const hasNameChanged =
        firstName !== authState.firstName || lastName !== authState.lastName;
      if (hasNameChanged) {
        formData.append(
          "updatedUserName",
          JSON.stringify({
            firstName: firstName,
            lastName: lastName,
          })
        );
      }

      if (hasNewImage || hasNameChanged) {
        axios({
          method: "post",
          url: `http://localhost:8080/users/${authState.userId}/update-user-data`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((response) => {
            dispatch(authActions.updateUserData(response.data));
            setIsDataUpdated(true);
          })
          .catch((e) => console.log(e));
      }
    }
  };

  return (
    <div className={styles.userProfile}>
      <div className={styles.linkToChat}>
        <Link to={"/"}>Back to chat</Link>
      </div>
      {createUserImage(authState)}
      <div className={styles.element}>
        <label htmlFor="image">
          {newImage ? "Selected image: " + newImage.name : "Upload a new image"}
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files[0];
            setNewImage(file);
          }}
        />
      </div>
      <div className={styles.element}>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </div>
      <div className={styles.element}>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </div>
      <div className={styles.element}>
        <label htmlFor="username">Username</label>
        <input id="username" value={authState.username} disabled />
      </div>
      <div className={styles.element}>
        <label htmlFor="email">Email</label>
        <input id="email" value={authState.email} disabled />
      </div>
      {exceptions === "" ? null : (
        <p
          style={{
            color: "red",
            backgroundColor: "white",
            padding: "0.25rem",
            borderRadius: "10px",
          }}
        >
          {exceptions}
        </p>
      )}
      <div className={styles.element}>
        <button onClick={handleChanges}>Change</button>
      </div>
      {isDataUpdated ? (
        <p style={{ color: "lightgreen" }}>
          Data has been successfuly updated!
        </p>
      ) : null}
    </div>
  );
};

export default UserProfile;
