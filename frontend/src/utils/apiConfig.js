const sanitizeBaseUrl = (url) => {
  if (!url) return null;
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const DEFAULT_BASE_URL = "http://localhost:8080";

export const BACKEND_BASE_URL =
  sanitizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_BASE_URL) ||
  DEFAULT_BASE_URL;

export const buildApiUrl = (path = "") => {
  if (!path) return BACKEND_BASE_URL;
  return `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
