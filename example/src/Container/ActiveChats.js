import React, { useEffect, useState } from "react";
import { getChatThreads, ChatSDK } from "../Logic";
import styled from "styled-components";

// COMPONENTS:
import ChatsList from "../Components/Chat/List";
import ChatMessages from "../Components/Chat/Messages";
import Loader from "../Components/Loader";

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
  const [isReady, setIsReady] = useState(false);
  const [chatInfo, setChatInfo] = useState({});
  const activeChatId = (chatInfo && chatInfo.id) || null;

  console.log(chatInfo, activeChatId)

  const { messages, setMessages } = useChatMessages(activeChatId);

  const pickChat = chatItem => {
    if (!chatItem) {
      setMessages([]);
      setChatInfo({})
    } else {
      const chatId = chatItem.id;
      const chatLastThreadId =
        (chatItem.thread && chatItem.thread.id) ||
        chatItem.last_thread_summary.id;

      setChatInfo(chatItem);
      getChatThreads(chatId, [chatLastThreadId]).then(({ chat }) => {
        if ((chat && chat.id) === chatId && chat.threads.length) {
          const msgs = chat.threads[0].events;
          setMessages(msgs);
        }

        setIsReady(true);
      });
    }
  };

  const { chatList, setChatList } = useChatList(pickChat);

  useEffect(() => {
    let isMounted = true;

    ChatSDK.getAgentDetails().then(data => {
      if (isMounted && data && data.chats_summary) {
        const agentsActiveChats = data.chats_summary;

        if (agentsActiveChats.length) {
          setChatList(agentsActiveChats);
          pickChat(agentsActiveChats[0]);
        } else {
          setIsReady(true);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) return <Loader />;

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
