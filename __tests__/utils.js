import { getRtmUrl, validateConfig } from "../src/utils";

describe("Utils", () => {
  test("validateConfig", () => {
    const validConfig = { account_token: "token" };
    const invalidConfig = { region: "europe" };

    // Valid case
    expect(validateConfig(validConfig)).toBe(true);

    // Invalid cases
    expect(validateConfig).toThrow(new Error("ChatSDK: Missing config"));
    expect(() => validateConfig(invalidConfig)).toThrow(
      new Error("ChatSDK: Incorrect config, missing 'account_token' value")
    );
  });

  test("getRtmUrl", () => {
    const versionRegex = new RegExp(/\/v([\d\.]*)\//);
    const newApiVersion = "1.1";

    expect(getRtmUrl()).toEqual(process.env.CHAT_RTM_URL);
    expect(getRtmUrl({ region: "america" })).toEqual(process.env.CHAT_RTM_URL);
    expect(getRtmUrl({ region: "europe" })).toEqual(
      process.env.EUROPE_CHAT_RTM_URL
    );

    const urlWithUpdatedVersion = getRtmUrl({ apiVersion: newApiVersion });
    expect(urlWithUpdatedVersion.match(versionRegex)[1]).toEqual(newApiVersion);
  });
});
