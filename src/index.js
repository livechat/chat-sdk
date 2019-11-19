import SocketClient from "./socket";
import mitt from "@livechat/mitt";
import { validateConfig } from "./utils";
import shortId from "shortid";
import {
  LOGIN,
  CONNECT,
  SEND_EVENT,
  API_NOT_READY,
  AGENT_NOT_LOGGED_IN,
  ERROR_METHOD_FACTORY_INCORRECT_PARAMS,
  ERROR_SEND_MESSAGE_MISSING_CHAT_ID
} from "./constants";

class SDK {
  constructor(config) {
    this.emitter = mitt();
    this._AGENT_API_RTM = new SocketClient(this.emitter, config);

    this._agentDetails = {};
    this._authConfig = null;
    this._isLoggedIn = false;
  }

  _checkRtmConnection = () => this._AGENT_API_RTM.checkIsRTMReady();

  /**
   * Checks if method is ready to call, otherwise its will be added to eventQueue.
   * Returns enhanced function with promise functionality
   */
  _promisify = func =>
    new Promise((resolve, reject) => {
      if (this._checkRtmConnection()) {
        return func(resolve, reject);
      } else {
        console.error(API_NOT_READY);
      }
    });

  /**
   * Login Agent to the system with access_token passed in init() method
   */
  _login = () => {
    const requestBody = {
      action: LOGIN,
      payload: { token: `Bearer ${this._authConfig.access_token}` }
    };

    return this.methodFactory(requestBody);
  };

  /**
   * Handle RTM API push notifications for internal SDK usage
   */
  _eventListeners = () => {
    this.on(CONNECT, () => {
      this._login()
        .then(data => {
          this._isLoggedIn = true;
          this._agentDetails = data;
        })
        .catch(err => {
          this._isLoggedIn = false;
          if (this.config.debug) console.warn(err);
        });
    });
  };

  // #### PUBLIC METHODS ####

  /**
   * Initialize RTM API connection
   * @param {object} authConfig - authorization config, should contain at least access_token param, config will be used to log in Agent
   */
  init = authConfig => {
    validateConfig(authConfig);
    this._authConfig = authConfig;

    this._eventListeners();
    this._AGENT_API_RTM.init();
  };

  /**
   * Close RTM connection and clear all event listeners
   */
  destroy = () => {
    this._AGENT_API_RTM.destroy();
  };

  /**
   * Method factory, allow to create custom API calls outside SDK class
   * @param {object} requestBody - payload that will be send to RTM API
   * @param {number} timeout - determiness how long promise will wait for response before rejection
   */
  methodFactory = (requestBody, timeout) =>
    this._promisify((resolve, reject) => {
      if (!requestBody || (requestBody && !requestBody.action)) {
        reject(ERROR_METHOD_FACTORY_INCORRECT_PARAMS);
      }

      const requestId = shortId.generate();
      const eventListener = requestBody && requestBody.action;

      this.on(eventListener, data => {
        if (data && data.request_id === requestId) {
          if (data.success) {
            resolve((data && data.payload) || {});
          } else {
            reject(data.error);
          }
        }
      });

      this._AGENT_API_RTM.send(requestId, requestBody, timeout);
    });

  /**
   * Gets currently logged agent info
   */
  getAgentDetails = () => {
    return this._promisify((resolve, reject) => {
      if (this._isLoggedIn) {
        resolve(this._agentDetails);
      } else {
        reject(AGENT_NOT_LOGGED_IN);
      }
    });
  };

  /**
   * Send event with plain text message
   */
  sendMessage = (chat_id, message = "", recipients = "all") => {
    if (!chat_id) throw new Error(ERROR_SEND_MESSAGE_MISSING_CHAT_ID);

    return this.methodFactory({
      action: SEND_EVENT,
      payload: {
        chat_id,
        event: {
          type: "message",
          text: message,
          recipients
        }
      }
    });
  };

  // ##### EMITTER METHODS #####
  on = (...args) => this.emitter.on(...args);
  once = (...args) => this.emitter.once(...args);
  off = (...args) => this.emitter.off(...args);
}

export default SDK;
