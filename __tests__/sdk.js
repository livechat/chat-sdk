import SDK from "../src";
import {
  ERROR_INIT_MISSING_CONFIG,
  ERROR_INIT_MISSING_TOKEN,
  ERROR_METHOD_FACTORY_INCORRECT_PARAMS,
  ERROR_SEND_MESSAGE_MISSING_CHAT_ID
} from "../src/constants";

let chatSDK;
const config = { access_token: "some_token" };

describe("SDK client", () => {
  beforeAll(() => (chatSDK = new SDK()));
  beforeEach(() => (chatSDK.destroy()));

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
    const spyRTMinit = jest.spyOn(chatSDK._AGENT_API_RTM, "init");

    chatSDK.init(config);

    expect(spyRTMinit).toHaveBeenCalled();
  });

  test("SDK destroy", () => {
    const spyRTMdestroy = jest.spyOn(chatSDK._AGENT_API_RTM, "destroy");

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
