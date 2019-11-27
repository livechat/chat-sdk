import React, { useEffect, useState } from "react";
import { getChatThreads, getArchives } from "../Logic";
import styled from "styled-components";

// COMPONENTS:
import ChatsList from "../Components/Chat/List";
import ChatMessages from "../Components/Chat/Messages";
import Loader from "../Components/Loader";

// STYLED COMPONENTS:
const Wrapper = styled.div`
  display: flex;
  height: 87%;
  min-height: 400px;
  padding: 1rem;
`;

/**
 * Displays archived chats
 */
const ArchivedChats = () => {
  const [chatList, setChatList] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const pickChat = chatItem => {
    const chatId = chatItem.id;
    const lastThreadId = chatItem.thread && chatItem.thread.id;

    getChatThreads(chatId, [lastThreadId]).then(({ chat }) => {
      setChatInfo(chat);

      if (chat.threads.length) {
        const msgs = chat.threads[0].events;
        setChatMessages(msgs);
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    getArchives().then(({ chats }) => {
      if (isMounted) {
        if (chats.length) pickChat(chats[0]);
        setChatList(chats);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!chatList) return <Loader />;

  return (
    <Wrapper>
      <ChatsList
        chatList={chatList}
        activeChatId={chatInfo && chatInfo.threads && chatInfo.threads[0].id}
        pickChat={pickChat}
      />
      <ChatMessages
        chatInfo={chatInfo}
        chatMessages={chatMessages}
        onlyMessages
      />
    </Wrapper>
  );
};

export default ArchivedChats;
