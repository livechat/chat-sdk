import PromiseController from "promise-controller";
import { replaceRequestError, requestTimeoutError } from "./constants";

export const DEFAULT_REQUEST_TIMEOUT = 10 * 1000;

class Requests {
  constructor() {
    this._items = new Map();
  }

  _rejectExistingRequest(requestId) {
    const existingRequest = this._items.get(requestId);
    if (existingRequest && existingRequest.isPending) {
      existingRequest.reject(new Error(replaceRequestError(requestId)));
    }
  }

  _promiseFinally(promise, callback) {
    return promise.finally(callback);
  }

  _createNewRequest(requestId, client, payload, timeout) {
    const request = new PromiseController({
      timeout,
      timeoutReason: requestTimeoutError(payload.action, timeout)
    });

    this._items.set(requestId, request);

    return this._promiseFinally(request.call(client(payload)), () =>
      this._deleteRequest(requestId, request)
    );
  }

  _deleteRequest(requestId, request) {
    if (this._items.get(requestId) === request) {
      this._items.delete(requestId);
    }
  }

  // ##### PUBLIC METHODS ######
  create(requestId, client, payload, timeout = DEFAULT_REQUEST_TIMEOUT) {
    this._rejectExistingRequest(requestId);
    return this._createNewRequest(requestId, client, payload, timeout);
  }

  resolve(requestId, data) {
    if (requestId && this._items.has(requestId)) {
      this._items.get(requestId).resolve(data);
    }
  }

  reject(requestId, error) {
    if (requestId && this._items.has(requestId)) {
      const request = this._items.get(requestId);

      if (request && request.isPending) {
        request.reject(error);
      }
    }
  }

  rejectAll(error) {
    this._items.forEach(request =>
      request.isPending ? request.reject(error) : null
    );
  }
}

export default Requests;
