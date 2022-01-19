import {
  ERROR_INIT_MISSING_CONFIG,
  ERROR_INIT_MISSING_TOKEN,
  NOT_SUPPORTED_API_VERSION
} from "./constants";

function checkIfApiVersionIsSupported(apiVersion) {
  if (!apiVersion) {
    return null;
  }

  apiVersion = apiVersion.includes("v")
    ? Number(apiVersion.substring(1))
    : Number(apiVersion);
  const supportedVersion = Number(process.env.STABLE_API_VERSION);

  if (apiVersion < supportedVersion) {
    console.warn(NOT_SUPPORTED_API_VERSION);
  }
}

export function validateConfig(config) {
  if (!config) {
    throw new Error(ERROR_INIT_MISSING_CONFIG);
  } else if (!config.access_token && !config.personal_access_token) {
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
    checkIfApiVersionIsSupported(apiVersion);

    url = url.replace(versionRegex, () => {
      const shouldIncludeVersionTag = !apiVersion.includes("v");
      return `/${shouldIncludeVersionTag ? "v" : ""}${apiVersion}/`;
    });
  }

  return url;
}
