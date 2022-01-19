import React, { useContext } from "react";
import { Button } from "@livechat/design-system";
import styled from '@emotion/styled';
import { ChatContext } from "../../context/chat";

const List = styled.div`
  padding: 0.5rem 2rem 1rem 1rem;
  margin-right: 1rem;
  width: 220px;
  border-right: 1px solid ${({ theme }) => theme.secondary};
  overflow-y: auto;

  > button {
    margin-bottom: 0.7rem;
  }
`;

const ChatList = () => {
  const { chatList, fetchMessages, activeChat } = useContext(ChatContext)

  const getThreadId = (chat) => {
    if (chat?.last_thread_summary) {
      return `${chat.last_thread_summary.id}`
    }

    return `${chat?.thread.id}`
  }

  return (
    <List>
      {chatList?.map((chatItem) => {
        const chatId = getThreadId(chatItem)
        const isActive = chatId === getThreadId(activeChat)
        const buttonType = isActive ? 'primary' : 'secondary'
        const customer = chatItem.users.find(({ type }) => type === 'customer')

        return (
          <Button
            key={chatId}
            onClick={() => fetchMessages(chatItem)}
            kind={buttonType}
            fullWidth
          >
            {customer?.name || 'customer'}
          </Button>
        );
      })}
    </List>
  )
};

export default ChatList;
