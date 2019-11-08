import SDK from "@livechat/chat-sdk";

// Initialize ChatSDK instance
export const ChatSDK = new SDK({
  debug: true,
});

// Custom methods created with `ChatSDK.methodFactory`:

/**
 * Returns list of last 10 archived chats
 * Based on: https://developers.livechatinc.com/docs/messaging/agent-chat-api/rtm-reference/#get-archives
 */
export const getArchives = () =>
  ChatSDK.methodFactory({
    action: "get_archives",
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
 * Based on: https://developers.livechatinc.com/docs/messaging/agent-chat-api/rtm-reference/#get-chat-threads
 */
export const getChatThreads = (chat_id, thread_ids) =>
  ChatSDK.methodFactory({
    action: "get_chat_threads",
    payload: { chat_id, thread_ids }
  });
