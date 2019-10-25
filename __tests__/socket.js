import Socket from "../src/socket";
import mitt from "@livechat/mitt";

let ws, emitter;
const mockedRequestBody = { action: "test" };

describe("Socket client", () => {
  beforeAll(() => {
    const config = { account_token: "some_token" };

    emitter = mitt();
    ws = new Socket(emitter, config);
  });

  test("send method before init", () => {
    expect(() => ws.send(mockedRequestBody)).toThrowError("Socket is not connected");
  });

  test("init", () => {
    const spyConnect = jest.spyOn(ws, "_connect");
    const spyListeners = jest.spyOn(ws, "_addEventListeners");

    ws.init();

    expect(ws.isOpen).toBe(true);
    expect(ws.isConnected).toBe(true);

    expect(spyConnect).toHaveBeenCalled();
    expect(spyListeners).toHaveBeenCalled();
  });

  // TODO: Fix test, expects are ignored
  test("send method", () => {
    const spySend = jest.spyOn(ws, "send");

    const getSocketResponse = () =>
      new Promise(resolve => {
        emitter.on(mockedRequestBody.action, data => {
          resolve(data);
        });

        ws.send(mockedRequestBody);
      });

    return getSocketResponse().then(data => {
      expect(data.payload).toEqual(mockedRequestBody);
      expect(spySend).toHaveBeenCalledWith(mockedRequestBody);
    });
  });

  test("destroy", () => {
    const spyDisconnect = jest.spyOn(ws, "_disconnect");
    const spyClose = jest.spyOn(ws, "_close");
    const spyRemoveListeners = jest.spyOn(ws, "_removeEventListeners");

    ws.destroy();

    expect(ws.isOpen).toBe(false);
    expect(ws.isConnected).toBe(false);

    expect(spyDisconnect).toHaveBeenCalled();
    expect(spyClose).toHaveBeenCalled();
    expect(spyRemoveListeners).toHaveBeenCalled();
  });

  test("send method after destroy", () => {
    expect(() => ws.send(mockedRequestBody)).toThrowError("Socket is not connected");
  });
});
