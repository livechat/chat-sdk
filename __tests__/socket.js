import SocketClient from "../src/socket";
import mitt from "@livechat/mitt";

let ws, emitter;
const mockedRequestBody = { action: "test" };
const mockedRequestId = "12345";

describe("SocketClient client", () => {
  beforeAll(() => {
    const config = { account_token: "some_token" };

    emitter = mitt();
    ws = new SocketClient(emitter, config);
  });

  beforeEach(() => ws.destroy())

  test("init", () => {
    const spyConnect = jest.spyOn(ws.client, "connect");

    ws.init();

    expect(spyConnect).toHaveBeenCalled();
  });

  test("send method", () => {
    ws.init();

    const spySend = jest.spyOn(ws, "send");
    const spyRequestsCreate = jest.spyOn(ws.requests, "create");

    ws.send(mockedRequestId, mockedRequestBody);

    expect(spySend).toHaveBeenCalledWith(mockedRequestId, mockedRequestBody);
    expect(spyRequestsCreate).toHaveBeenCalled();
  });

  test("destroy", () => {
    const spyDestroy = jest.spyOn(ws.client, "destroy");
    const spyEmitter = jest.spyOn(ws.emitter, "off");

    ws.destroy();

    expect(spyEmitter).toHaveBeenCalled();
    expect(spyDestroy).toHaveBeenCalled();
  });
});
