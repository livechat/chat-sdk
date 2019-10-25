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
  PING
} from "./constants";

class Socket {
  constructor(emitter, config, socket = SockJS) {
    this.config = config;
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

  _login = ({ account_token }) => {
    if (!this.isLoggedIn) {
      this.send({
        action: LOGIN,
        payload: { token: `Bearer ${account_token}` }
      });

      this.emitter.on(LOGIN, data => {
        if (data.success) {
          this.isLoggedIn = true;
        } else {
          const error = JSON.stringify(data.payload) || "Invalid account_token";
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
    this._login(this.config);
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
    if (!this.isOpen) throw new Error("Socket is not opened.");
    if (this._socket !== null) this.close();
    if (delay === 0) delay = this._backoff.duration();

    clearTimeout(this._reconnectTimer);
    this._reconnectTimer = setTimeout(this._connect, delay);
  };

  _close() {
    this._removeEventListeners(this._socket);
    this.isConnected = false;
    this._socket.close();
    this._socket = null;
  }

  _disconnect = () => {
    this.isOpen = false;
    clearTimeout(this._reconnectTimer);

    if (this._socket !== null) {
      this._close();
    }
  };

  // PUBLIC METHODS
  init = () => {
    if (this.isOpen) throw new Error("Socket is already open");
    this._connect();
  };

  send = payload => {
    if (!this.isConnected) throw new Error("Socket is not connected");
    if (payload.action !== PING && this.config.debug) {
      console.log("Send: ", payload);
    }
    this._socket.send(JSON.stringify(payload));
  };

  destroy = () => {
    this.emitter.off();
    this._disconnect();
  };
}

export default Socket;
