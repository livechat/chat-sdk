import { useState, useEffect } from "react";
import { ChatSDK } from "../Logic";

/**
 * Handle chat messages related to passed chatId
 * @param {*} chatId 
 */
export function useChatMessages(chatId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleThreads = ({ payload }) => {
      if (
        payload.chat &&
        payload.chat.id === chatId &&
        payload.chat.threads.length
      ) {
        const msgs = payload.chat.threads[0].events;
        setMessages(msgs);
      }
    };

    const handleNewMessages = ({ payload }) => {
      if (payload.chat_id === chatId) {
        const msgs = [...messages, payload.event];
        setMessages(msgs);
      }
    };

    // Listen to incoming messages
    ChatSDK.on("incoming_event", handleNewMessages);

    // Listen to event sent after fetch chat threads
    ChatSDK.on("get_chat_threads", handleThreads);

    return () => {
      ChatSDK.off("get_chat_threads", handleThreads);
      ChatSDK.off("incoming_event", handleNewMessages);
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
    const handleIncomingChats = data => {
      const incomingChat = data.payload.chat;

      if (!chatList.some(({ id }) => id === incomingChat.id)) {
        if (!chatList.length) pickChat(incomingChat);
        setChatList([...chatList, incomingChat]);
      }
    };

    const handleClosingThread = data => {
      const closedChat = data.payload.chat_id;
      const updatedChatList = chatList.filter(({ id }) => id !== closedChat);

      setChatList(updatedChatList);
    };

    ChatSDK.on("incoming_chat_thread", handleIncomingChats);
    ChatSDK.on("thread_closed", handleClosingThread);

    return () => {
      ChatSDK.off("incoming_chat_thread", handleIncomingChats);
      ChatSDK.off("thread_closed", handleClosingThread);
    };
  }, [chatList, pickChat]);

  return { chatList, setChatList };
}
