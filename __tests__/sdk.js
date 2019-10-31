import SDK from "../src/";
import {
  ERROR_INIT_MISSING_CONFIG,
  ERROR_INIT_MISSING_TOKEN,
  ERROR_METHOD_FACTORY_INCORRECT_PARAMS,
  ERROR_SEND_MESSAGE_MISSING_CHAT_ID
} from "../src/constants";

let chatSDK;
const mockedRequestBody = { action: "test" };
const config = { access_token: "some_token" };

describe("SDK client", () => {
  beforeEach(() => (chatSDK = new SDK()));

  test("Create new SDK instance", () => {
    expect(() => new SDK()).not.toThrow();
  });

  test("Initialize SDK instance without config", () => {
    expect(() => chatSDK.init()).toThrowError(ERROR_INIT_MISSING_CONFIG);
  });

  test("Initialize SDK instance with incorrect config", () => {
    expect(() => chatSDK.init({})).toThrowError(ERROR_INIT_MISSING_TOKEN);
  });

  test("Initialize SDK init", () => {
    const spyEventQueue = jest.spyOn(chatSDK, "_handleEventQueue");
    const spyEventListeners = jest.spyOn(chatSDK, "_eventListeners");
    const spyRTMinit = jest.spyOn(chatSDK._RTM, "init");

    chatSDK.init(config);

    expect(spyEventQueue).toHaveBeenCalled();
    expect(spyEventListeners).toHaveBeenCalled();
    expect(spyRTMinit).toHaveBeenCalled();
  });

  test("SDK destroy", () => {
    const spyRTMdestroy = jest.spyOn(chatSDK._RTM, "destroy");

    chatSDK.destroy();

    expect(spyRTMdestroy).toHaveBeenCalled();
  });

  test("SDK methodFactory - without request body", () => {
    chatSDK.init(config);

    const customMethod = () => chatSDK.methodFactory();

    return customMethod().catch(err => {
      expect(err).toMatch(ERROR_METHOD_FACTORY_INCORRECT_PARAMS);
    });
  });

  test("SDK methodFactory", () => {
    const spyRTMdsend = jest.spyOn(chatSDK._RTM, "send");

    chatSDK.init(config);

    const customMethod = () => chatSDK.methodFactory(mockedRequestBody);

    return customMethod().then(data => {
      expect(data).toEqual(mockedRequestBody);
      expect(spyRTMdsend).toHaveBeenCalledWith(mockedRequestBody);
    });
  });

  test("SDK getAgentDetails", () => {
    chatSDK.init(config);

    return chatSDK.getAgentDetails().then(data => {
      expect(data).toEqual({});
    });
  });

  test("SDK sendMessage", () => {
    chatSDK.init(config);

    const responseBody = {
      action: "send_event",
      payload: {
        chat_id: "chat_id",
        event: { type: "message", text: "Hello World!", recipients: "all" }
      }
    };

    return chatSDK.sendMessage("chat_id", "Hello World!").then(data => {
      expect(data).toEqual(responseBody);
    });
  });

  test("SDK sendMessage - without chat_id param", () => {
    chatSDK.init(config);

    expect(() => chatSDK.sendMessage()).toThrowError(
      ERROR_SEND_MESSAGE_MISSING_CHAT_ID
    );
  });

  test("SDK emitter - on", () => {
    const spyEmitterOn = jest.spyOn(chatSDK.emitter, "on");

    chatSDK.on("test", () => {});
    expect(spyEmitterOn).toHaveBeenCalled();
  });

  test("SDK emitter - once", () => {
    const spyEmitterOnce = jest.spyOn(chatSDK.emitter, "once");

    chatSDK.once("test", () => {});
    expect(spyEmitterOnce).toHaveBeenCalled();
  });

  test("SDK emitter - off", () => {
    const spyEmitterOff = jest.spyOn(chatSDK.emitter, "off");

    chatSDK.off("test", () => {});
    expect(spyEmitterOff).toHaveBeenCalled();
  });
});
