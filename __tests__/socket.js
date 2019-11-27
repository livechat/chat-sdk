import SocketClient from "../src/socket";
import mitt from "@livechat/mitt";

let ws, sdkEmitter, platformEmitter;
const mockedRequestBody = { action: "test" };
const mockedRequestId = "12345";

describe("SocketClient client", () => {
  beforeAll(() => {
    sdkEmitter = mitt();
    platformEmitter = mitt();
    ws = new SocketClient({ sdkEmitter, platformEmitter, config: {} });
  });

  test("init", () => {
    const spyConnect = jest.spyOn(ws.client, "connect");

    ws.init();

    expect(spyConnect).toHaveBeenCalled();
  });

  test("send method", () => {
    const spySend = jest.spyOn(ws, "send");
    const spyRequestsCreate = jest.spyOn(ws.requests, "create");

    ws.send(mockedRequestId, mockedRequestBody);

    expect(spySend).toHaveBeenCalledWith(mockedRequestId, mockedRequestBody);
    expect(spyRequestsCreate).toHaveBeenCalled();
  });

  test("destroy", () => {
    const spyDestroy = jest.spyOn(ws.client, "destroy");
    const spyEmitter = jest.spyOn(ws._platformEmitter, "off");

    ws.destroy();

    expect(spyEmitter).toHaveBeenCalled();
    expect(spyDestroy).toHaveBeenCalled();
  });
});
