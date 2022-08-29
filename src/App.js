import { useSelector } from "react-redux";
import "./App.css";
import ChatGroup from "./components/ChatGroup";
import AuthForm from "./components/AuthForm";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="App">{isAuthenticated ? <ChatGroup /> : <AuthForm />}</div>
  );
};

export default App;
