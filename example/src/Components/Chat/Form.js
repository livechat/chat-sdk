import React, { useState } from "react";
import { Form, InputField } from "@livechat/design-system";
import { ChatSDK } from "../../Logic";

const ChatForm = ({ chatId }) => {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = ({ target }) => setInputValue(target.value);

  const sendMessage = e => {
    e.preventDefault();

    ChatSDK.sendMessage(chatId, inputValue);
    setInputValue("");
  };

  return (
    <Form onSubmit={sendMessage} style={{ width: "100%" }}>
      <InputField
        disabled={!chatId}
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
