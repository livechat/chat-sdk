import { useState, useEffect } from "react";
import { ChatSDK } from "../Logic";

/**
 * Handle chat messages related to passed chatId
 * @param {*} chatId 
 */
export function useChatMessages(chatId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const handleThreads = ({ payload }) => {
      if (
        isMounted &&
        payload.chat &&
        payload.chat.id === chatId &&
        payload.chat.threads.length
      ) {
        const msgs = payload.chat.threads[0].events;
        setMessages(msgs);
      }
    };

    const handleNewMessages = ({ payload }) => {
      if (isMounted && payload.chat_id === chatId) {
        const msgs = [...messages, payload.event];
        setMessages(msgs);
      }
    };

    // Listen to incoming messages
    ChatSDK.on("incoming_event", handleNewMessages);

    // Listen to event sent after fetch chat threads
    ChatSDK.on("incoming_chat_thread", handleThreads);

    return () => {
      ChatSDK.off("incoming_chat_thread", handleThreads);
      ChatSDK.off("incoming_event", handleNewMessages);
      isMounted = false
    };
  }, [chatId, messages]);

  return {
    messages,
    setMessages
  };
}

/** 
 * Handle changes on active chat list
 * - add new chats to list
 * - remove closed chats from list
 * @param {function} pickChat - function that pick chat from list
*/
export function useChatList(pickChat) {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const handleIncomingChats = data => {
      const incomingChat = data.payload.chat;

      if (isMounted && !chatList.some(({ id }) => id === incomingChat.id)) {
        if (!chatList.length) pickChat(incomingChat);
        setChatList([...chatList, incomingChat]);
      }
    };

    const handleClosingThread = data => {
      const closedChat = data.payload.chat_id;
      const updatedChatList = chatList.filter(({ id }) => id !== closedChat);

      if (isMounted) {
        setChatList(updatedChatList);
      }
    };

    ChatSDK.on("incoming_chat_thread", handleIncomingChats);
    ChatSDK.on("thread_closed", handleClosingThread);

    return () => {
      ChatSDK.off("incoming_chat_thread", handleIncomingChats);
      ChatSDK.off("thread_closed", handleClosingThread);
      isMounted = false;
    };
  }, [chatList, pickChat]);

  return { chatList, setChatList };
}
