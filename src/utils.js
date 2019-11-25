import {
  ERROR_INIT_MISSING_CONFIG,
  ERROR_INIT_MISSING_TOKEN
} from "./constants";

export function validateConfig(config) {
  if (!config) {
    throw new Error(ERROR_INIT_MISSING_CONFIG);
  } else if (!config.access_token) {
    throw new Error(ERROR_INIT_MISSING_TOKEN);
  } else {
    return true;
  }
}

export function getRtmUrl({ region, apiVersion } = {}) {
  // eslint-disable-next-line
  const versionRegex = new RegExp(/\/v([\d\.]*)\//);

  let url =
    region && region.toLowerCase() === "europe"
      ? process.env.EUROPE_CHAT_RTM_URL
      : process.env.CHAT_RTM_URL;

  if (apiVersion) {
    url = url.replace(versionRegex, () => {
      const shouldIncludeVersionTag = !apiVersion.includes("v");
      return `/${shouldIncludeVersionTag ? "v" : ""}${apiVersion}/`;
    });
  }

  return url;
}
