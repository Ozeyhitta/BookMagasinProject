import axios from "axios";
import { buildApiUrl } from "./apiConfig";

const LEGACY_BASE_URL = "http://localhost:8080";

const normalizeLegacyBase = (url = "") =>
  url.endsWith("/") ? url.slice(0, -1) : url;

const legacyBase = normalizeLegacyBase(LEGACY_BASE_URL);

const rewriteLegacyUrl = (value) => {
  if (typeof value !== "string") return null;
  if (!value.startsWith(legacyBase)) return null;

  const suffix = value.slice(legacyBase.length) || "/";
  return buildApiUrl(suffix);
};

let fetchPatched = false;
const patchFetch = () => {
  if (fetchPatched) return;
  if (typeof globalThis.fetch !== "function") return;

  const nativeFetch = globalThis.fetch.bind(globalThis);

  const rewriteInput = (input) => {
    if (typeof input === "string") {
      const rewritten = rewriteLegacyUrl(input);
      return rewritten ?? input;
    }

    if (typeof Request !== "undefined" && input instanceof Request) {
      const rewritten = rewriteLegacyUrl(input.url);
      if (rewritten) {
        return new Request(rewritten, input);
      }
    }

    return input;
  };

  const describeInput = (input) => {
    if (typeof input === "string") return input;
    if (typeof Request !== "undefined" && input instanceof Request) {
      return input.url;
    }
    return "[unknown request]";
  };

  globalThis.fetch = (input, init) => {
    const nextInput = rewriteInput(input);
    return nativeFetch(nextInput, init).catch((error) => {
      console.error("Fetch failed for", describeInput(nextInput), error);
      throw error;
    });
  };

  fetchPatched = true;
};

let axiosConfigured = false;
const configureAxios = () => {
  if (axiosConfigured) return;

  axios.defaults.baseURL = buildApiUrl("/api");
  axios.defaults.headers.common["Content-Type"] = "application/json";

  axios.interceptors.request.use((config) => {
    if (typeof config.url === "string") {
      const rewritten = rewriteLegacyUrl(config.url);
      if (rewritten) {
        config.baseURL = "";
        config.url = rewritten;
      }
    }
    return config;
  });

  axiosConfigured = true;
};

let initialized = false;
export const ensureHttpClients = () => {
  if (initialized) return;
  patchFetch();
  configureAxios();
  initialized = true;
};
