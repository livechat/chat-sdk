import React, { useEffect, useState } from "react";
import { getChatThreads, ChatSDK } from "../Logic";
import styled from "styled-components";

// COMPONENTS:
import ChatsList from "../Components/Chat/List";
import ChatMessages from "../Components/Chat/Messages";

// CUSTOM HOOKS:
import { useChatList, useChatMessages } from "../Hooks";

// STYLED COMPONENTS:
const Wrapper = styled.div`
  display: flex;
  height: 87%;
  min-height: 400px;
  padding: 1rem;
`;

/**
 * Display currently active agent's chats
 */
const ActiveChats = () => {
  const [chatInfo, setChatInfo] = useState({});
  const activeChatId = (chatInfo && chatInfo.id) || null;

  const pickChat = chatItem => {
    const chatId = chatItem.id;
    const chatLastThreadId =
      (chatItem.thread && chatItem.thread.id) ||
      chatItem.last_thread_summary.id;

    setChatInfo(chatItem);
    getChatThreads(chatId, [chatLastThreadId]);
  };

  const { chatList, setChatList } = useChatList(pickChat);
  const { messages } = useChatMessages(activeChatId);

  useEffect(() => {
    let isMounted = true;

    ChatSDK.getAgentDetails().then(data => {
      if (isMounted && data && data.chats_summary) {
        const agentsActiveChats = data.chats_summary;
        if (agentsActiveChats.length) {
          pickChat(agentsActiveChats[0]);
          setChatList(agentsActiveChats);
        }
      }
    });

    return () => isMounted = false;
  }, [setChatList]);

  return (
    <Wrapper>
      <ChatsList
        chatList={chatList}
        activeChatId={activeChatId}
        pickChat={pickChat}
      />
      <ChatMessages chatInfo={chatInfo} chatMessages={messages} />
    </Wrapper>
  );
};

export default ActiveChats;
