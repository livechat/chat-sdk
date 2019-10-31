import { getRtmUrl, validateConfig } from "../src/utils";
import {
  ERROR_INIT_MISSING_CONFIG,
  ERROR_INIT_MISSING_TOKEN
} from "../src/constants";

describe("Utils", () => {
  test("validateConfig", () => {
    const validConfig = { access_token: "token" };
    const invalidConfig = { region: "europe" };

    // Valid case
    expect(validateConfig(validConfig)).toBe(true);

    // Invalid cases
    expect(validateConfig).toThrowError(ERROR_INIT_MISSING_CONFIG);
    expect(() => validateConfig(invalidConfig)).toThrowError(
      ERROR_INIT_MISSING_TOKEN
    );
  });

  test("getRtmUrl", () => {
    // eslint-disable-next-line
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
