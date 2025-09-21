let authToken = localStorage.getItem('authToken');

function handleResponse(res) {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const api = {
  setToken: (token) => {
    authToken = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },
  getToken: () => authToken,
  login: (username, password) => fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse),
  get: (path) => fetch(path, { headers: getHeaders() }).then(handleResponse),
  post: (path, data) => fetch(path, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  put: (path, data) => fetch(path, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (path) => fetch(path, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};