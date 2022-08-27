import { useSelector } from "react-redux";
import "./App.css";
import ChatGroup from "./components/ChatGroup";
import LoginForm from "./components/LoginForm";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="App">{isAuthenticated ? <ChatGroup /> : <LoginForm />}</div>
  );
};

export default App;
