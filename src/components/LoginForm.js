import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/redux-store";

const LoginForm = () => {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();

  const handleAuthentication = (event) => {
    event.preventDefault();
    dispatch(authActions.authenticate({ userId: userName }));
  };

  return (
      <form onSubmit={(event) => handleAuthentication(event)}>
        <input
          placeholder="Enter your name"
          onChange={(event) => setUserName(event.target.value)}
        ></input>
        <input type={"submit"} value="Login"></input>
      </form>
  );
};

export default LoginForm;