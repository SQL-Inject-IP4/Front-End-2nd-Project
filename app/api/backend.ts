const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

export const BACKEND_URL =
  configuredBackendUrl === undefined
    ? "http://localhost:4000"
    : configuredBackendUrl.replace(/\/+$/, "");

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
