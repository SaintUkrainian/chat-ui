import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/redux-store";
import styles from "./css/LoginForm.module.css";

const AuthForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleAuthentication = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8080/auth/login", { username: userName, password: password }).then(response => {
      dispatch(
        authActions.authenticate(response.data)
      );
    });
  };

  return (
    // <form onSubmit={(event) => handleAuthentication(event)}>
    //   <input
    //     placeholder="Enter your name"
    //     onChange={(event) => setUserName(event.target.value)}
    //   ></input>
    //   <input type={"submit"} value="Login"></input>
    // </form>
    <div className={styles.main}>
      <input type="checkbox" id={styles.chk} aria-hidden="true" />

      <div className={styles.signup}>
        <form onSubmit={(event) => event.preventDefault()}>
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
            placeholder="User name"
            required=""
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            required=""
          />
          <input
            className={styles.input}
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
          />
          <button className={styles.button}>Sign up</button>
        </form>
      </div>

      <div className={styles.login}>
        <form onSubmit={(event) => handleAuthentication(event)}>
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
            placeholder="Username"
            onChange={(event) => setUserName(event.target.value)}
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
