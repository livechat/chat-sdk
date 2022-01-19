import React, { useState, useContext } from "react";
import { Form, InputField } from "@livechat/design-system";
import { ChatContext } from '../../context/chat';

const ChatForm = () => {
  const { sendMessage, activeChat } = useContext(ChatContext)

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = ({ target }) => setInputValue(target.value);

  const sendChatMessage = e => {
    e.preventDefault();
    sendMessage(activeChat?.id, inputValue);
    setInputValue("");
  };

  return (
    <Form onSubmit={sendChatMessage} style={{ width: "100%" }}>
      <InputField
        disabled={!activeChat}
        value={inputValue}
        id="chat-message"
        placeholder="Write message..."
        onChange={handleInputChange}
        style={{ width: "100%", marginTop: "auto" }}
      />
    </Form>
  );
};

export default ChatForm;
