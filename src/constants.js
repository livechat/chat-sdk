// RTM API
export const LOGIN = "login";
export const SEND_EVENT = "send_event";

// WEBSOCKET:
export const CONNECT = "connect";
export const DISCONNECT = "disconnect";
export const OPEN = "open";
export const CLOSE = "close";
export const MESSAGE = "message";
export const HEARTBEAT = "heartbeat";
export const PING = "ping";

// ERRORS:
export const INVALID_TOKEN = "ChatSDK: Invalid token";
export const SOCKET_NOT_OPENED = "ChatSDK: Socket is not opened.";
export const SOCKET_ALREADY_OPEN = "ChatSDK: Socket is already open.";
export const SOCKET_NOT_CONNECTED = "ChatSDK: Socket is not connected.";
export const ERROR_INIT_MISSING_CONFIG = "ChatSDK.init: Missing config";
export const ERROR_INIT_MISSING_TOKEN =
  "ChatSDK.init: Incorrect config, missing 'access_token' value";
export const ERROR_METHOD_FACTORY_INCORRECT_PARAMS =
  "ChatSDK.methodFactory: Incorrect requestBody parameter";
export const ERROR_SEND_MESSAGE_MISSING_CHAT_ID =
  "ChatSDK.sendMessage: Missing chat_id param";
