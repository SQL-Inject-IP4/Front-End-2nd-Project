const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const hasConfiguredBackendUrl = Boolean(configuredBackendUrl);

export const BACKEND_URL =
  hasConfiguredBackendUrl
    ? configuredBackendUrl!.replace(/\/+$/, "")
    : import.meta.env.PROD
      ? ""
      : "http://localhost:4000";

export async function backendFetch(path: string, init: RequestInit = {}, cookie?: string) {
  const headers = new Headers(init.headers);

  if (cookie) {
    headers.set("cookie", cookie);
  }

  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });
}
