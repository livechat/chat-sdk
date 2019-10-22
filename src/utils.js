export function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function validateConfig(config) {
  if (!config) {
    throw new Error("ChatSDK: Missing config");
  } else if (!config.account_token) {
    throw new Error("ChatSDK: Incorrect config, missing 'account_token' value");
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
