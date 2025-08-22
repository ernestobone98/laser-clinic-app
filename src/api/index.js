function handleResponse(res) {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export const api = {
  get: (path) => fetch(path).then(handleResponse),
  post: (path, data) => fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  put: (path, data) => fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (path) => fetch(path, {
    method: 'DELETE',
  }).then(handleResponse),
};