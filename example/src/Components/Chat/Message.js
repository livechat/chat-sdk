import React from "react";
import { Message, SystemMessage, FilledForm } from '../event'

const ChatMessage = ({ users, message }) => {
  const getChatUser = authorId => users.find(({ id }) => id === authorId) || { type: "customer" };

  switch (message?.type) {
    case "message":
      const user = getChatUser(message.author_id);

      return (
        <Message key={message.id} message={message} user={user} />
      );

    case "system_message":
      return <SystemMessage key={message.id} message={message} />;

    case "filled_form":
      return <FilledForm key={message.id} message={message} />;

    default:
      return null;
  }
}

export default ChatMessage;
