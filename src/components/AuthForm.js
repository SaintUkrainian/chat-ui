import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/redux-store";
import styles from "./css/LoginForm.module.css";

const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        dispatch(authActions.authenticate(response.data));
      });
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/auth/register", {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email
      })
      .then((response) => {
        dispatch(authActions.authenticate(response.data));
      });
  };

  return (
    <div className={styles.main}>
      <input type="checkbox" id={styles.chk} aria-hidden="true" />
      <div className={styles.signup}>
        <form onSubmit={(event) => handleRegistration(event)}>
          <label
            className={styles.label}
            htmlFor={styles.chk}
            aria-hidden="true"
          >
            Sign up
          </label>
          <input
            className={styles.input}
            type="text"
            name="txt"
            placeholder="First Name"
            required=""
            onChange={(event) => setFirstName(event.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            name="txt"
            placeholder="Last Name"
            required=""
            onChange={(event) => setLastName(event.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            name="txt"
            placeholder="Username"
            required=""
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            required=""
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className={styles.button}>Sign up</button>
        </form>
      </div>

      <div className={styles.login}>
        <form onSubmit={(event) => handleLogin(event)}>
          <label
            className={styles.label}
            htmlFor={styles.chk}
            aria-hidden="true"
          >
            Login
          </label>
          <input
            className={styles.input}
            type="text"
            name="txt"
            placeholder="username"
            onChange={(event) => setUsername(event.target.value)}
            required=""
          />
          <input
            className={styles.input}
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
