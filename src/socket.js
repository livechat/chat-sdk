import platformClient from "@livechat/platform-client";
import Requests from "./requests";
import { getRtmUrl } from "./utils";
import {
  SOCKET_ALREADY_OPEN,
  SOCKET_DISCONNECT_ERROR,
  CONNECT,
  DISCONNECT,
  MESSAGE,
  LOG_RESPONSE,
  LOG_PUSH,
  LOG_SEND
} from "./constants";

class SocketClient {
  constructor({ sdkEmitter, platformEmitter, config }) {
    this.config = config;
    this._sdkEmitter = sdkEmitter;
    this._platformEmitter = platformEmitter;

    this.client = platformClient(getRtmUrl(config), {
      emitter: this._platformEmitter
    });
    this._handleIncomingEvents();

    this.isConnected = false;
    this.requests = new Requests(this.client.emit);
  }

  _handleIncomingEvents = () => {
    this.client.on(CONNECT, () => {
      this.isConnected = true;
    });

    this.client.on(DISCONNECT, () => {
      this.isConnected = false;
      this.requests.rejectAll(SOCKET_DISCONNECT_ERROR);
    });

    this.client.on(MESSAGE, message => {
      if (message.request_id) {
        if (this.config.debug) {
          console.log(LOG_RESPONSE, message);
        }

        // handle responses
        if (message.success) {
          this.requests.resolve(message.request_id, message);
        } else {
          this.requests.reject(message.request_id, message);
        }
      }

      // handle push messages
      if (message.type === "push") {
        if (message && message.action) {
          if (this.config.debug) {
            console.log(LOG_PUSH, message);
          }

          this._sdkEmitter.emit(message.action, message);
        }
      }
    });
  };

  // PUBLIC METHODS
  checkIsRTMReady = () => this.client.getReadyState() === 1;

  /**
   * Initialize connection with RTM API
   */
  init = () => {
    if (this.isConnected) {
      console.warn(SOCKET_ALREADY_OPEN);
    } else {
      this.client.connect();
    }
  };

  /**
   * Create an request and send it to the API
   * @param requestId - ID that will be used to identify this request
   * @param requestBody - request payload
   * @param timeout - time after request will be rejected
   */
  send = (requestBody, timeout) => {
    if (this.config.debug) {
      console.log(LOG_SEND, requestBody);
    }

    return this.requests.create(requestBody, timeout);
  };

  /**
   * Clears event listeners and disconnect API
   */
  destroy = () => {
    this.client.destroy();
    this._platformEmitter.off();
  };
}

export default SocketClient;
