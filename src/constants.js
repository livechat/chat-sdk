// RTM API EVENTS:
export const LOGIN = "login";
export const SEND_EVENT = "send_event";
export const READY = "ready";

// WEBSOCKET:
export const CONNECT = "connect";
export const DISCONNECT = "disconnect";
export const MESSAGE = "message";

// SOCKET LOGS:
export const LOG_RESPONSE = "Receive response: ";
export const LOG_PUSH = "Receive push: ";
export const LOG_SEND = "Send: ";

// REQUESTS:
export const requestTimeoutError = (timeout, action) =>
  `Action${
    action ? `: '${action}'` : " "
  } was rejected by timeout (${timeout} ms).`;

// ERRORS:
export const NOT_SUPPORTED_API_VERSION =
  "ChatSDK: Provided API version is no longer supported";
export const API_NOT_READY = "ChatSDK: API is not ready yet";
export const AGENT_NOT_LOGGED_IN =
  "ChatSDK.getAgentDetails: Agent is not logged in yet";
export const SOCKET_ALREADY_OPEN = "ChatSDK: Socket is already open";
export const SOCKET_DISCONNECT_ERROR =
  "ChatSDK: Rejected all pending request due to WebSocket disconnection";
export const ERROR_INIT_MISSING_CONFIG = "ChatSDK.init: Missing config";
export const ERROR_INIT_MISSING_TOKEN =
  "ChatSDK.init: Incorrect config, missing token value";
export const ERROR_METHOD_FACTORY_INCORRECT_PARAMS =
  "ChatSDK.methodFactory: Incorrect requestBody parameter";
export const ERROR_SEND_MESSAGE_MISSING_CHAT_ID =
  "ChatSDK.sendMessage: Missing chat_id param";
export const ERROR_SEND_MESSAGE_MISSING_MESSAGE =
  "ChatSDK.sendMessage: Missing message";

// DEFAULT SKD CONFIG
export const defaultConfig = {
  apiVersion: process.env.STABLE_API_VERSION
};
