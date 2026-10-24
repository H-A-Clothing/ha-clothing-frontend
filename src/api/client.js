// Shared API client. Every module file in src/api/ calls the backend through this.
import { API_BASE_URL } from "../utils/constants";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length) url.searchParams.set(key, value.join(","));
    } else {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

async function request(method, path, { params, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    // Shared error shape: { message, details? }
    throw new ApiError(response.status, data?.message ?? "Request failed", data?.details);
  }
  return data;
}

export const apiClient = {
  get: (path, params) => request("GET", path, { params }),
  post: (path, body) => request("POST", path, { body }),
  put: (path, body) => request("PUT", path, { body }),
  patch: (path, body) => request("PATCH", path, { body }),
  delete: (path) => request("DELETE", path),
};

// Simulates network latency for mock responses.
export function mockResponse(data, delay = 250) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay));
}
