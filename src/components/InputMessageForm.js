import React, { useState } from "react";
import { useSelector } from "react-redux";

const InputMessageForm = (props) => {
  const [input, setInput] = useState("");
  const userId = useSelector((state) => state.auth.userId);

  const handleSubmit = (event) => {
    event.preventDefault();
    props.stompClient.send(
      props.path,
      {},
      JSON.stringify({ fromUser: userId, value: input})
    );
    setInput("");
  };

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type={"text"}
          placeholder={"Your message..."}
          onChange={(event) => setInput(event.target.value)}
          value={input}
          style={{width: "350px", height: "30px"}}
        ></input>
        <input type={"submit"} value="Send"></input>
      </form>
    </div>
  );
};

export default InputMessageForm;
