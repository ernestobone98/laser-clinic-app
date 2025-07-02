const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function handleResponse(res) {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export const api = {
  get: (path) => fetch(`${API_URL}${path}`).then(handleResponse),
  post: (path, data) => fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  put: (path, data) => fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (path) => fetch(`${API_URL}${path}`, {
    method: 'DELETE',
  }).then(handleResponse),
};