import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/redux-store";
import styles from "./css/LoginForm.module.css";

const LoginForm = () => {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();

  const handleAuthentication = (event) => {
    event.preventDefault();
    dispatch(authActions.authenticate({ userId: userName }));
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
          <label className={styles.label} htmlFor={styles.chk} aria-hidden="true">
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
          <label className={styles.label} htmlFor={styles.chk} aria-hidden="true">
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
          />
          <button className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
