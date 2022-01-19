import SDK from "@livechat/chat-sdk";

// Initialize ChatSDK instance
export const ChatSDK = new SDK({
  debug: true,
});

// Custom methods created with `ChatSDK.methodFactory`:

/**
 * Returns list of last 10 archived chats
 * Based on: https://developers.livechat.com/docs/messaging/agent-chat-api/rtm-reference/#get-archives
 */
export const getArchives = () =>
  ChatSDK.methodFactory({
    action: "list_archives",
    payload: {
      pagination: {
        limit: 10
      }
    }
  });

/**
 * Returns threads that the current Agent has access to in a given chat.
 * @param {string} chat_id 
 * @param {string[]} thread_ids 
 * Based on: https://developers.livechat.com/docs/messaging/agent-chat-api/rtm-reference/#get-chat-threads
 */
export const getChat = (chat_id, thread_id) =>
  ChatSDK.methodFactory({
    action: "get_chat",
    payload: { chat_id, thread_id }
  });

/**
 * Returns threads that the current Agent has access to in a given chat.
 * @param {string} chat_id 
 * @param {string[]} thread_ids 
 * Based on: https://developers.livechat.com/docs/messaging/agent-chat-api/rtm-reference/#get-chat-threads
 */
export const getChatsList = () =>
  ChatSDK.methodFactory({
    action: "list_chats",
  });
