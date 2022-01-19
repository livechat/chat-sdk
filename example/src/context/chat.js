import React, { createContext } from 'react'
import { useAgentDetails } from '../hooks/use-agent-details'
import { useChatMessages } from '../hooks/use-chat-messages'
import { getChatsList, getArchives } from '../utils/chat-sdk'

export const ChatContext = createContext({})

const ChatProvider = ({ children }) => {
  const { agentDetails } = useAgentDetails();
  const {
    fetchMessages,
    messages,
    sendMessage,
    chatList,
    setChatList,
    activeChat,
  } = useChatMessages();

  const getActiveChats = async () => {
    try {
      const { chats_summary } = await getChatsList()
      const activeChats = chats_summary.filter(chat => chat?.last_thread_summary?.active)

      setChatList(activeChats);

      if (activeChats?.length) {
        await fetchMessages(activeChats[0]);
      }
    } catch (error) {
      console.error(`Unable to fetch agent chats: `, error)
    }
  }

  const getArchivedChats = async () => {
    try {
      const { chats } = await getArchives()
      setChatList(chats);

      if (chats?.length) {
        await fetchMessages(chats[0]);
      }
    } catch (error) {
      console.error(`Unable to fetch archived chats: `, error)
    }
  }

  return (
    <ChatContext.Provider value={{
      chatList,
      setChatList,
      messages,
      sendMessage,
      activeChat,
      fetchMessages,
      agentDetails,
      getActiveChats,
      getArchivedChats,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
