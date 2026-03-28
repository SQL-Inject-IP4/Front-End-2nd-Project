import { backendFetch } from "./backend";

export type StyleSettings = {
  id: string;
  backgroundColor: string;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: {
    id: string;
    email: string;
    name: string | null;
    role: "EDITOR" | "VIEWER";
  } | null;
};

export async function fetchStyle(cookie?: string): Promise<StyleSettings> {
  const response = await backendFetch("/api/style", {}, cookie);

  if (!response.ok) {
    throw new Error("Failed to fetch style");
  }

  return response.json() as Promise<StyleSettings>;
}

export async function sendBackgroundColor(color: string): Promise<StyleSettings> {
  const response = await backendFetch("/api/style", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      backgroundColor: color
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update background color");
  }

  return response.json() as Promise<StyleSettings>;
}

export async function sendFont(font: string): Promise<StyleSettings> {
  const response = await backendFetch("/api/style", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fontFamily: font
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update font");
  }

  return response.json() as Promise<StyleSettings>;
}
