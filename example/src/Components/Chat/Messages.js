import React, { useRef, useEffect } from "react";
import styled from "styled-components";

// COMPONENTS:
import ChatForm from "./Form";
import Message from "../Events/Message";
import SystemMessage from "../Events/SystemMessage";
import FilledForm from "../Events/FilledForm";
import ChatInstruction from "./ChatInstruction";

// STYLED COMPONENTS:
const Wrapper = styled.div`
  height: 98%;
  width: calc(100% - 220px);
  padding: 0.5rem 1rem;
`;

const MessageWrapper = styled.div`
  height: ${({ onlyMessages }) => (onlyMessages ? "100%" : "89%")};
  overflow-y: auto;

  & > .lc-card {
    background: ${({ theme }) => theme.secondary};
    display: inline-block;
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

/**
 * Display chat messages
 */
const ChatMessages = ({ chatInfo, chatMessages, onlyMessages = false }) => {
  const ref = useRef();

  const getChatUser = authorId => {
    const chatUsers = chatInfo.users;
    return chatUsers.find(({ id }) => id === authorId) || { type: "customer" };
  };

  useEffect(() => {
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [chatMessages]);

  return (
    <Wrapper>
      <MessageWrapper ref={ref} onlyMessages={onlyMessages}>
        {chatMessages &&
          chatMessages.map(message => {
            const user = getChatUser(message.author_id);

            switch (message.type) {
              case "message":
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
          })}

        {chatInfo && chatMessages && !chatMessages.length && (
          <ChatInstruction />
        )}
      </MessageWrapper>

      {!onlyMessages && <ChatForm chatId={(chatInfo && chatInfo.id) || null} />}
    </Wrapper>
  );
};

export default ChatMessages;
