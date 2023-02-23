import APIKit from "./apiKit";

function getUrl(uri) {
  return `/${uri}`;
}

export function getFacebookUrl() {
  return APIKit.get(getUrl(`users/facebook/url`));
}

export default {
  getFacebookUrl,
};
