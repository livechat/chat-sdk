import mitt from "@livechat/mitt";
import SocketClient from "./socket";
import { validateConfig } from "./utils";
import {
  LOGIN,
  READY,
  CONNECT,
  SEND_EVENT,
  API_NOT_READY,
  AGENT_NOT_LOGGED_IN,
  ERROR_METHOD_FACTORY_INCORRECT_PARAMS,
  ERROR_SEND_MESSAGE_MISSING_CHAT_ID,
  ERROR_SEND_MESSAGE_MISSING_MESSAGE,
  defaultConfig
} from "./constants";

class SDK {
  constructor(config = {}) {
    this.config = Object.assign({}, defaultConfig, config);

    this.sdkEmitter = mitt();
    this.platformEmitter = mitt();

    this._AGENT_API_RTM = new SocketClient({
      sdkEmitter: this.sdkEmitter,
      platformEmitter: this.platformEmitter,
      config
    });

    this._agentDetails = {};
    this._authConfig = null;
    this._isLoggedIn = false;
  }

  _checkRtmConnection = () => this._AGENT_API_RTM.checkIsRTMReady();

  /**
   * Checks if method is ready to call.
   * Returns enhanced function with promise functionality
   */
  _promisify = func =>
    new Promise((resolve, reject) => {
      if (this._checkRtmConnection()) {
        return func(resolve, reject);
      } else {
        reject(API_NOT_READY);
      }
    });

  /**
   * Returns proper token header value based on this._authConfig
   */
  _getToken = () => {
    if (this._authConfig.personal_access_token) {
      return `Basic ${this._authConfig.personal_access_token}`;
    } else if (this._authConfig.access_token) {
      return `Bearer ${this._authConfig.access_token}`;
    }

    return null;
  };

  /**
   * Login Agent to the system with config passed in init() method
   */
  _login = () => {
    const requestBody = {
      action: LOGIN,
      payload: { token: this._getToken() }
    };

    return this.methodFactory(requestBody);
  };

  /**
   * Handle RTM API push notifications for internal SDK usage
   */
  _eventListeners = () => {
    this.platformEmitter.on(CONNECT, () => {
      this._login()
        .then(data => {
          this._isLoggedIn = true;
          this._agentDetails = data;

          this.sdkEmitter.emit(READY);
        })
        .catch(err => {
          this._isLoggedIn = false;

          if (this.config.debug) {
            console.warn(err);
          }
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
   * @param {number} timeout - determines how long promise will wait for response before rejection
   */
  methodFactory = (requestBody, timeout) =>
    this._promisify((resolve, reject) => {
      if (!requestBody || (requestBody && !requestBody.action)) {
        reject(ERROR_METHOD_FACTORY_INCORRECT_PARAMS);
      }

      this._AGENT_API_RTM
        .send(requestBody, timeout)
        .then(data => resolve(data && data.payload))
        .catch(err => reject(err));
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
  sendMessage = (chat_id, message, recipients = "all") => {
    if (!chat_id) throw new Error(ERROR_SEND_MESSAGE_MISSING_CHAT_ID);
    if (!message) throw new Error(ERROR_SEND_MESSAGE_MISSING_MESSAGE);

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
  on = (...args) => this.sdkEmitter.on(...args);
  once = (...args) => this.sdkEmitter.once(...args);
  off = (...args) => this.sdkEmitter.off(...args);
}

export default SDK;
