import React, { useRef, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import ChatForm from "./Form";
import Message from "./Message";
import Instruction from "./Instruction";
import { ChatContext } from '../../context/chat';

const Wrapper = styled.div`
  height: 98%;
  width: calc(100% - 220px);
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
`;

const MessageWrapper = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const ChatMessages = ({ onlyMessages = false }) => {
  const ref = useRef();

  const { messages, activeChat, chatList } = useContext(ChatContext)
  const chatUsers = activeChat?.users || [];

  useEffect(() => {
    if (ref.current) {
      // Scroll to the bottom of the chat with every new message
      ref.current.scrollTo(0, ref.current.scrollHeight);
    }
  }, [messages]);

  if (!chatList?.length) {
    return (
      <Wrapper>
        <Instruction />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <MessageWrapper ref={ref} onlyMessages={onlyMessages}>
        {messages?.map(message => <Message key={message?.id} message={message} users={chatUsers} />)}
      </MessageWrapper>

      {!onlyMessages && <ChatForm chatId={activeChat?.id} />}
    </Wrapper>
  );
};

export default ChatMessages;
