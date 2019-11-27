import { generateRandomId } from "@livechat/data-utils";
import { requestTimeoutError } from "./constants";
import RequestController, {
  DEFAULT_REQUEST_TIMEOUT
} from "./requestController";

class Requests {
  constructor(socketEmitter) {
    this._socketEmitter = socketEmitter;
    this._items = new Map();
  }

  _promiseFinally(promise, callback) {
    return promise.finally(callback);
  }

  _deleteRequest(requestId) {
    this._items.delete(requestId);
  }

  _generateUniqueId() {
    const id = generateRandomId();
    return this._items.has(id) ? this._generateUniqueId() : id;
  }

  // ##### PUBLIC METHODS ######

  create(requestBody, timeout = DEFAULT_REQUEST_TIMEOUT) {
    const requestId = this._generateUniqueId();
    const payload = { request_id: requestId, ...requestBody };

    const request = new RequestController({
      timeout,
      timeoutReason: requestTimeoutError(timeout, payload.action),
      action: () => this._socketEmitter(payload)
    });

    this._items.set(requestId, request);

    return this._promiseFinally(request.start(), () =>
      this._deleteRequest(requestId)
    );
  }

  resolve(requestId, data) {
    if (requestId && this._items.has(requestId)) {
      this._items.get(requestId).resolve(data);
    }
  }

  reject(requestId, error) {
    if (requestId && this._items.has(requestId)) {
      this._items.get(requestId).reject(error);
    }
  }

  rejectAll(error) {
    this._items.forEach(request => request.reject(error));
  }
}

export default Requests;
