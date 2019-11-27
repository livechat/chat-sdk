import React from "react";
import { Button } from "@livechat/design-system";
import styled from 'styled-components';

const List = styled.div`
  padding: 0.5rem 2rem 1rem 1rem;
  margin-right: 1rem;
  width: 220px;
  border-right: 1px solid ${({ theme }) => theme.secondary};
  overflow-y: auto;
`;

const ChatList = ({ chatList, activeChatId, pickChat }) => (
  <List>
    {chatList &&
      !!chatList.length &&
      chatList.map(chatItem => {
        const chatId = chatItem.id
        const threadId = chatItem.thread && chatItem.thread.id;
        const isActive = activeChatId === threadId || activeChatId === chatId;
        const customerName = chatItem.users[0].name;
        const handleClick = () => pickChat(chatItem);

        return (
          <Button
            key={threadId+chatId}
            onClick={handleClick}
            style={{ marginBottom: 10 }}
            primary={isActive}
            secondary={!isActive}
            fullWidth
          >
            {customerName}
          </Button>
        );
      })}
  </List>
);

export default ChatList;
