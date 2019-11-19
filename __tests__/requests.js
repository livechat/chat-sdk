import Requests, { DEFAULT_REQUEST_TIMEOUT } from "../src/requests";

let requests;

const mockedRequestId = "12345";
const mockedClient = () => {};
const mockedPayload = { action: "test" };

const mockedRequestPayload = [mockedRequestId, mockedClient, mockedPayload];

describe("Requests", () => {
  beforeAll(() => (requests = new Requests()));
  beforeEach(() => requests.rejectAll());

  test("Create new request", () => {
    const spyRejectExistingRequest = spyOn(requests, "_rejectExistingRequest");
    const spyCreateRequest = spyOn(requests, "_createNewRequest");

    requests.create(...mockedRequestPayload);

    expect(spyRejectExistingRequest).toHaveBeenCalledWith(mockedRequestId);
    expect(spyCreateRequest).toHaveBeenCalledWith(
      ...mockedRequestPayload,
      DEFAULT_REQUEST_TIMEOUT
    );
  });

  test("Replace existing request", () => {
    const spyRejectExistingRequest = spyOn(requests, "_rejectExistingRequest");
    const spyCreateRequest = spyOn(requests, "_createNewRequest");

    // Create initial request
    requests.create(...mockedRequestPayload);

    // reject previous request and replace it
    requests.create(mockedRequestId, mockedClient, { action: "test2" });

    expect(spyRejectExistingRequest).toHaveBeenCalledWith(mockedRequestId);
    expect(spyCreateRequest).toHaveBeenCalledWith(
      mockedRequestId,
      mockedClient,
      { action: "test2" },
      DEFAULT_REQUEST_TIMEOUT
    );
  });

  test("Reject pending request", () => {
    requests.create(...mockedRequestPayload);
    expect(requests._items.has(mockedRequestId)).toBe(true);

    requests.reject(mockedRequestId);
    expect(requests._items.get(mockedRequestId)._isRejected).toBe(true);
  });

  test("Resolve pending request", () => {
    requests.create(...mockedRequestPayload);
    expect(requests._items.has(mockedRequestId)).toBe(true);

    requests.resolve(mockedRequestId);
    expect(requests._items.get(mockedRequestId)._isFulfilled).toBe(true);
  });

  test("Reject all pending requests", () => {
    requests.create(...mockedRequestPayload);
    expect(requests._items.has(mockedRequestId)).toBe(true);

    requests.rejectAll();
    expect(requests._items.get(mockedRequestId)._isRejected).toBe(true);
  });
});
