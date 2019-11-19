import Client from "@livechat/platform-client";
import { getRtmUrl } from "./utils";
import { SOCKET_ALREADY_OPEN, CONNECT, DISCONNECT, MESSAGE } from "./constants";
import Request from "./requests";

class SocketClient {
  constructor(emitter, config = {}) {
    this.emitter = emitter;
    this.config = config;
    this.isConnected = false;

    this.client = new Client(getRtmUrl(config), { emitter: this.emitter });
    this._handleIncomingEvents();

    this.requests = new Request();
  }

  _handleIncomingEvents = () => {
    this.client.on(CONNECT, () => {
      this.isConnected = true;
    });

    this.client.on(DISCONNECT, () => {
      this.isConnected = false;
      this.requests.rejectAll();
    });

    this.client.on(MESSAGE, message => {
      try {
        this.requests.resolve(message.request_id, message);

        if (message && message.action) {
          this.emitter.emit(message.action, message);

          if (this.config.debug) {
            console.log("Receive: ", message);
          }
        }
      } catch (err) {
        this.requests.reject(message.request_id, err);
        if (this.config.debug) console.warn(err);
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
  send = (requestId, requestBody, timeout) => {
    const payload = { request_id: requestId, ...requestBody };
    this.requests.create(requestId, this.client.emit, payload, timeout);

    if (this.config.debug) {
      console.log("Send: ", payload);
    }
  };

  /**
   * Clears event listeners and disconnect API
   */
  destroy = () => {
    this.emitter.off();
    this.client.destroy();
  };
}

export default SocketClient;
