import SockJS from "sockjs-client";
import Backoff from "backo2";
import { debounce, getRtmUrl } from "./utils";
import {
  LOGIN,
  DISCONNECT,
  CONNECT,
  OPEN,
  CLOSE,
  MESSAGE,
  HEARTBEAT,
  PING,
  INVALID_TOKEN,
  SOCKET_NOT_OPENED,
  SOCKET_ALREADY_OPEN,
  SOCKET_NOT_CONNECTED
} from "./constants";

class Socket {
  constructor(emitter, config = {}, socket = SockJS) {
    this.config = config;
    this.authConfig = null;
    this.emitter = emitter;

    this._backoff = new Backoff({
      min: 1000,
      max: 4000,
      jitter: 0.5
    });

    this._socket_url = getRtmUrl(this.config);

    this._socketClient = socket;
    this._socket = null;
    this._reconnectTimer = null;
    this.isOpen = false;
    this.isConnected = false;
    this.isLoggedIn = false;
  }

  _login = () => {
    if (!this.isLoggedIn && this.authConfig) {
      this.send({
        action: LOGIN,
        payload: { token: `Bearer ${this.authConfig.access_token}` }
      });

      this.emitter.on(LOGIN, data => {
        if (data.success) {
          this.isLoggedIn = true;
        } else {
          const error = JSON.stringify(data.payload) || INVALID_TOKEN;
          throw new Error(error);
        }
      });
    }
  };

  // MAINTAIN SOCKET CONNECTION
  _ping = () => {
    this.send({ action: PING });
  };

  _schedulePing = () =>
    debounce(() => {
      if (!this.isOpen) return;
      if (this.isConnected) this._ping();
      this._schedulePing();
    }, 15 * 1000);

  // WebSocket EVENT HANDLERS
  _onClose = () => {
    this.isConnected = false;
    this.isLoggedIn = false;
    this._socket = null;
    this.emitter.emit(DISCONNECT);
    this._reconnect();
  };

  _onOpen = () => {
    this.isConnected = true;
    this._backoff.reset();
    this._schedulePing();
    this._login();
    this.emitter.emit(CONNECT);
  };

  _onMessage = payload => {
    try {
      const message = JSON.parse(payload.data);

      if (message && message.action) {
        if (message.action === PING) return;
        else this.emitter.emit(message.action, message);

        if (this.config.debug) {
          console.log("Receive: ", message);
        }
      }
    } catch (e) {
      if (this.config.debug) console.warn(e);
    }
  };

  _onHeartbeat = () => {
    this._ping();
    this._schedulePing();
  };

  _addEventListeners = instance => {
    instance.addEventListener(OPEN, this._onOpen);
    instance.addEventListener(CLOSE, this._onClose);
    instance.addEventListener(MESSAGE, this._onMessage);
    instance.addEventListener(HEARTBEAT, this._onHeartbeat);
  };

  _removeEventListeners = instance => {
    instance.removeEventListener(OPEN, this._onOpen);
    instance.removeEventListener(CLOSE, this._onClose);
    instance.removeEventListener(MESSAGE, this._onMessage);
    instance.removeEventListener(HEARTBEAT, this._heartbeatListener);
  };

  // WEBSOCKET LIFECYCLE METHODS
  _connect = () => {
    this.isOpen = true;
    this._socket = new this._socketClient(this._socket_url);
    this._addEventListeners(this._socket);
  };

  _reconnect = delay => {
    if (!this.isOpen) throw new Error(SOCKET_NOT_OPENED);
    if (this._socket !== null) this._closeSocketConnection();
    if (delay === 0) delay = this._backoff.duration();

    clearTimeout(this._reconnectTimer);
    this._reconnectTimer = setTimeout(this._connect, delay);
  };

  _closeSocketConnection() {
    this._removeEventListeners(this._socket);
    this.isConnected = false;
    this._socket.close();
    this._socket = null;
  }

  _disconnect = () => {
    this.isOpen = false;
    clearTimeout(this._reconnectTimer);

    if (this._socket !== null) {
      this._closeSocketConnection();
    }
  };

  // PUBLIC METHODS
  /**
   * Initialize WebSocket connection and log in Agent
   */
  init = authConfig => {
    if (this.isOpen) {
      console.warn(SOCKET_ALREADY_OPEN);
    } else {
      this.authConfig = authConfig;
      this._connect();
    }
  };

  /**
   * Send event to RTM API
   */
  send = payload => {
    if (!this.isConnected) throw new Error(SOCKET_NOT_CONNECTED);
    if (payload.action !== PING && this.config.debug) {
      console.log("Send: ", payload);
    }
    this._socket.send(JSON.stringify(payload));
  };

  /**
   * Disconnect RTM API connection
   */
  destroy = () => {
    this.emitter.off();
    this._disconnect();
  };
}

export default Socket;
