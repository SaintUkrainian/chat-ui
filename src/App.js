import { useSelector } from "react-redux";
import "./App.css";
import ChatGroup from "./components/ChatGroup";
import AuthForm from "./components/AuthForm";
import React from "react";
import { Route } from "react-router-dom";
import UserProfile from "./components/UserProfile";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const chatComponents = (
    <React.Fragment>
      <Route path={"/"} exact>
        <ChatGroup />
      </Route>
      <Route path={"/profile"} exact>
        <UserProfile />
      </Route>
    </React.Fragment>
  );

  return (
    <div className="App">{isAuthenticated ? chatComponents : <AuthForm />}</div>
  );
};

export default App;
