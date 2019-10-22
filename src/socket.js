import SockJS from "sockjs-client";
import Backoff from "backo2";
import { debounce, getRtmUrl } from "./utils";
import * as ev from "./constants";

class Socket {
  constructor(emitter, config) {
    this.config = config;
    this.emitter = emitter;

    this._backoff = new Backoff({
      min: 1000,
      max: 4000,
      jitter: 0.5
    });

    this._socket_url = getRtmUrl(this.config);

    this._socket = null;
    this._reconnectTimer = null;
    this.isOpen = false;
    this.isConnected = false;
    this.isLoggedIn = false;
  }

  login = ({ account_token }) => {
    if (!this.isLoggedIn) {
      this.send({
        action: ev.LOGIN,
        payload: { token: `Bearer ${account_token}` }
      });

      this.emitter.on(ev.LOGIN, data => {
        if (data.success) this.isLoggedIn = true;
        else {
          const error = JSON.stringify(data.payload) || "Invalid account_token";
          throw new Error(error);
        }
      });
    }
  };

  // MAINTAIN SOCKET CONNECTION
  ping = () => {
    this.send({ action: ev.PING });
  };

  schedulePing = () =>
    debounce(() => {
      if (!this.isOpen) return;
      if (this.isConnected) this.ping();
      this.schedulePing();
    }, 15 * 1000);

  // WebSocket EVENT HANDLERS
  _onClose = () => {
    this.isConnected = false;
    this.isLoggedIn = false;
    this._socket = null;
    this.emitter.emit(ev.DISCONNECT);
    this.reconnect();
  };

  _onOpen = () => {
    this.isConnected = true;
    this._backoff.reset();
    this.schedulePing();
    this.login(this.config);
    this.emitter.emit(ev.CONNECT);
  };

  _onMessage = payload => {
    try {
      const message = JSON.parse(payload.data);

      if (message && message.action) {
        if (message.action === ev.PING) return;
        else this.emitter.emit(message.action, message);

        if (this.config.debug) console.log("Receive: ", message);
      }
    } catch (e) {
      if (this.config.debug) console.warn(e);
    }
  };

  _onHeartbeat = () => {
    this.ping();
    this.schedulePing();
  };

  _addEventListeners = instance => {
    instance.addEventListener(ev.OPEN, this._onOpen);
    instance.addEventListener(ev.CLOSE, this._onClose);
    instance.addEventListener(ev.MESSAGE, this._onMessage);
    instance.addEventListener(ev.HEARTBEAT, this._onHeartbeat);
  };

  _removeEventListeners = instance => {
    instance.removeEventListener(ev.OPEN, this._onOpen);
    instance.removeEventListener(ev.CLOSE, this._onClose);
    instance.removeEventListener(ev.MESSAGE, this._onMessage);
    instance.removeEventListener(ev.HEARTBEAT, this._heartbeatListener);
  };

  // INITIALIZATION
  _connect = () => {
    this.isOpen = true;

    this._socket = new SockJS(this._socket_url, undefined, {
      transports: ["websocket", "xhr-polling"]
    });

    this._addEventListeners(this._socket);
  };

  init = () => {
    if (this.isOpen) throw new Error("Socket is already open");
    this._connect();
  };

  // WebSocket METHODS
  send = payload => {
    if (!this.isConnected) throw new Error("Socket is not connected");
    if (payload.action !== ev.PING && this.config.debug) {
      console.log("Send: ", payload);
    }
    this._socket.send(JSON.stringify(payload));
  };

  reconnect = delay => {
    if (!this.isOpen) throw new Error("Socket is not opened.");
    if (this._socket !== null) this.close();
    if (delay === void 0) delay = this._backoff.duration();

    clearTimeout(this._reconnectTimer);
    this._reconnectTimer = setTimeout(this._connect, delay);
  };

  close() {
    this._removeEventListeners(this._socket);
    this.isConnected = false;
    this._socket.close();
    this._socket = null;
  }

  disconnect = () => {
    this.isOpen = false;
    clearTimeout(this._reconnectTimer);
    if (this._socket === null) return;
    this.close();
  };

  destroy = () => {
    this.emitter.off();
    this.disconnect();
  };
}

export default Socket;
