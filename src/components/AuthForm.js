import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/redux-store";
import styles from "./css/LoginForm.module.css";
import commonStyles from "./css/CommonStyles.module.css";

const BASE_AUTH_URL = "http://localhost:8081/auth"
const LOGIN_URL = BASE_AUTH_URL + "/login";
const REGISTER_URL = BASE_AUTH_URL + "/register";
const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loginFailed, setLoginFailed] = useState({
    isFailed: false,
    message: null,
  });
  const [registrationFailed, setRegistrationFailed] = useState({
    isFailed: false,
    message: null,
  });
  const dispatch = useDispatch();

  const errorInputStyle = {
    backgroundColor: "lightcoral",
  };

  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post(LOGIN_URL, {
        username: username,
        password: password,
      })
      .then((response) => {
        dispatch(authActions.authenticate(response.data));
      })
      .catch((error) => {
        setLoginFailed({
          isFailed: true,
          message: error.response.data.message,
        });
      });
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    axios
      .post(REGISTER_URL, {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      })
      .then((response) => {
        dispatch(authActions.authenticate(response.data));
      })
      .catch((error) => {
        setRegistrationFailed({
          isFailed: true,
          message: error.response.data.message,
        });
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
          {registrationFailed.isFailed ? (
            <p className={commonStyles.error}>{registrationFailed.message}</p>
          ) : null}
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
            style={registrationFailed.isFailed ? errorInputStyle : null}
            type="text"
            name="txt"
            placeholder="Username"
            required=""
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            className={styles.input}
            style={registrationFailed.isFailed ? errorInputStyle : null}
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
          {loginFailed.isFailed ? (
            <p className={commonStyles.error}>{loginFailed.message}</p>
          ) : null}
          <input
            className={styles.input}
            style={loginFailed.isFailed ? errorInputStyle : null}
            type="text"
            name="txt"
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
            required=""
          />
          <input
            className={styles.input}
            style={loginFailed.isFailed ? errorInputStyle : null}
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
