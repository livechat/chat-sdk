import Socket from "./socket";
import mitt from "@livechat/mitt";
import { validateConfig } from "./utils";
import {
  LOGIN,
  SEND_EVENT,
  ERROR_METHOD_FACTORY_INCORRECT_PARAMS,
  ERROR_SEND_MESSAGE_MISSING_CHAT_ID
} from "./constants";

class SDK {
  constructor(config) {
    this.emitter = mitt();
    this._RTM = new Socket(this.emitter, config);

    this._eventQueue = [];
    this._agentDetails = {};
  }

  _checkRtmConnection = () => this._RTM.isConnected;
  _checkIfRtmIsEventReady = () => this._RTM.isConnected && this._RTM.isLoggedIn;

  /**
   * Handle event queue (this._eventQueue)
   * Iterate over functions that was called before API was ready to handle them
   * (Interval clear itself after successful login to RTM API and clearing all functions from eventQueue array)
   */
  _handleEventQueue = () => {
    this.queueInterval = setInterval(() => {
      if (this._checkIfRtmIsEventReady() && this._eventQueue.length) {
        const func = this._eventQueue.shift();
        return func();
      } else if (this._checkIfRtmIsEventReady() && !this._eventQueue.length) {
        clearInterval(this.queueInterval);
      }
    }, 150);
  };

  /**
   * Checks if method is ready to call, otherwise its will be added to eventQueue.
   * Returns enhanced function with promise functionality
   */
  _promisify = func =>
    new Promise((resolve, reject) => {
      if (this._checkRtmConnection()) {
        return func(resolve, reject);
      } else {
        this._eventQueue.push(() => func(resolve, reject));
      }
    });

  /**
   * Handle RTM API push notifications for internal SDK usage
   */
  _eventListeners = () => {
    this.on(LOGIN, data => {
      if (data.success) {
        this._agentDetails = data.payload;
      }
    });
  };

  // #### PUBLIC METHODS ####

  /**
   * Initialize RTM API connection
   * @param {object} config - authorization config, should contain at least access_token param, config will be used to log in Agent
   */
  init = config => {
    validateConfig(config);

    this._handleEventQueue();
    this._eventListeners();
    this._RTM.init(config);
  };

  /**
   * Close RTM connection and clear all event listeners
   */
  destroy = () => {
    this._RTM.destroy();
  };

  /**
   * Method factory, allow to create custom API calls outside SDK class
   * @param {object} requestBody - payload that will be send to RTM API
   * @param {string} pushListener (optional) - push notification that function will listen to after call to API
   */
  methodFactory = (requestBody, pushListener) =>
    this._promisify((resolve, reject) => {
      if (!requestBody || (requestBody && !requestBody.action)) {
        reject(ERROR_METHOD_FACTORY_INCORRECT_PARAMS);
      }

      const eventListener = pushListener || (requestBody && requestBody.action);

      this.on(eventListener, data => {
        if (data.success) resolve((data && data.payload) || {});
        else reject(data.error);
      });

      this._RTM.send(requestBody);
    });

  /**
   * Gets currently logged agent info
   */
  getAgentDetails = () => {
    return this._promisify(resolve => resolve(this._agentDetails));
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
