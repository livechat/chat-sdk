import { requestTimeoutError } from "./constants";

const WEB_SOCKET_CYCLE = 15; // sec
export const DEFAULT_REQUEST_TIMEOUT = (WEB_SOCKET_CYCLE + 5) * 1000;

const defaultOptions = {
  timeout: DEFAULT_REQUEST_TIMEOUT,
  timeoutReason: requestTimeoutError(DEFAULT_REQUEST_TIMEOUT)
};

class RequestController {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };

    this._promise = null;
    this._resolve = null;
    this._reject = null;

    this._isPending = false;
    this._isSettled = false;

    this.timeout = null;
  }

  _handleTimeout = () => {
    this.timeout = setTimeout(
      () => this.reject(this.options.timeoutReason),
      this.options.timeout
    );

    return this.timeout;
  };

  _createPromise() {
    this._promise = new Promise((resolve, reject) => {
      this._isPending = true;
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  _callAction() {
    if (this.options.action && typeof this.options.action === "function") {
      try {
        this.options.action();
      } catch (e) {
        this.reject(e);
      }
    }
  }

  // #### PUBLIC METHODS ####

  start() {
    if (!this._isPending) {
      this._createPromise();
      this._callAction();
    }

    Promise.race([this._promise, this._handleTimeout()]);

    return this._promise;
  }

  resolve(value) {
    if (this._isPending) {
      this._isPending = false;
      this._isSettled = true;

      this._resolve(value);
      clearTimeout(this.timeout);
    }
  }

  reject(value) {
    if (this._isPending) {
      this._isPending = false;
      this._isSettled = true;

      this._reject(value);
      clearTimeout(this.timeout);
    }
  }
}

export default RequestController;
