import { useAuthStore } from "../store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || "Request failed",
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  get: (url: string) => fetchWithAuth(url, { method: "GET" }),

  post: (url: string, data?: unknown) =>
    fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  patch: (url: string, data?: unknown) =>
    fetchWithAuth(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (url: string) => fetchWithAuth(url, { method: "DELETE" }),
};
