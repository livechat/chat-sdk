import SDK from "../src/";

const mockedRequestBody = { action: "test" };
const config = { account_token: "some_token" };

describe("SDK client", () => {
  test("Create new SDK instance without config", () => {
    expect(() => new SDK()).toThrowError("ChatSDK: Missing config");
  });

  test("Create new SDK instance with incorrect config", () => {
    expect(() => new SDK({})).toThrowError(
      "ChatSDK: Incorrect config, missing 'account_token' value"
    );
  });

  test("Create new SDK instance", () => {
    expect(() => new SDK(config)).not.toThrow();
  });

  test("SDK init", () => {
    const chatSDK = new SDK(config);
    const spyEventQueue = jest.spyOn(chatSDK, "_handleEventQueue");
    const spyEventListeners = jest.spyOn(chatSDK, "_eventListeners");
    const spyRTMinit = jest.spyOn(chatSDK._RTM, "init");

    chatSDK.init();

    expect(spyEventQueue).toHaveBeenCalled();
    expect(spyEventListeners).toHaveBeenCalled();
    expect(spyRTMinit).toHaveBeenCalled();
  });

  test("SDK destroy", () => {
    const chatSDK = new SDK(config);
    const spyRTMdestroy = jest.spyOn(chatSDK._RTM, "destroy");

    chatSDK.destroy();

    expect(spyRTMdestroy).toHaveBeenCalled();
  });

  test("SDK methodFactory - without request body", () => {
    const chatSDK = new SDK(config);
    chatSDK.init();

    const customMethod = () => chatSDK.methodFactory();

    return customMethod().catch(err => {
      expect(err).toMatch(
        "ChatSDK.methodFactory: Incorrect requestBody parameter"
      );
    });
  });

  test("SDK methodFactory", () => {
    const chatSDK = new SDK(config);
    const spyRTMdsend = jest.spyOn(chatSDK._RTM, "send");

    chatSDK.init();

    const customMethod = () => chatSDK.methodFactory(mockedRequestBody);

    return customMethod().then(data => {
      expect(data).toEqual(mockedRequestBody);
      expect(spyRTMdsend).toHaveBeenCalledWith(mockedRequestBody);
    });
  });

  test("SDK getAgentDetails", () => {
    const chatSDK = new SDK(config);
    chatSDK.init();

    return chatSDK.getAgentDetails().then(data => {
      expect(data).toEqual({});
    });
  });

  test("SDK sendMessage", () => {
    const chatSDK = new SDK(config);
    chatSDK.init();

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
    const chatSDK = new SDK(config);
    chatSDK.init();

    expect(() => chatSDK.sendMessage()).toThrowError(
      "ChatSDK.sendMessage: Missing chat_id param"
    );
  });

  test("SDK emitter - on", () => {
    const chatSDK = new SDK(config);
    const spyEmitterOn = jest.spyOn(chatSDK.emitter, "on");

    chatSDK.on("test", () => {});
    expect(spyEmitterOn).toHaveBeenCalled();
  });

  test("SDK emitter - once", () => {
    const chatSDK = new SDK(config);
    const spyEmitterOnce = jest.spyOn(chatSDK.emitter, "once");

    chatSDK.once("test", () => {});
    expect(spyEmitterOnce).toHaveBeenCalled();
  });

  test("SDK emitter - off", () => {
    const chatSDK = new SDK(config);
    const spyEmitterOff = jest.spyOn(chatSDK.emitter, "off");

    chatSDK.off("test", () => {});
    expect(spyEmitterOff).toHaveBeenCalled();
  });
});
