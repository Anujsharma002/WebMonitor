const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getStatus() {
  return fetch(`${API_BASE}/status`).then(handleResponse);
}

export async function getLinks() {
  return fetch(`${API_BASE}/links`).then(handleResponse);
}

export async function addLink(url) {
  return fetch(`${API_BASE}/links?url=${encodeURIComponent(url)}`, {
    method: "POST"
  }).then(handleResponse);
}

export async function checkLink(id) {
  return fetch(`${API_BASE}/check/${id}`, { method: "POST" })
    .then(handleResponse);
}

export async function getHistory(id) {
  return fetch(`${API_BASE}/history/${id}`).then(handleResponse);
}