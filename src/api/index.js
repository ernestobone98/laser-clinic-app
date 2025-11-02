let authToken = localStorage.getItem('authToken');

function handleResponse(res) {
  console.log(`API Response: ${res.status} ${res.statusText} for ${res.url}`);
  if (!res.ok) {
    console.error(`API Error: ${res.status} ${res.statusText}`);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
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
  login: (username, password) => {
    console.log('API Login: Attempting login for', username);
    return fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(handleResponse);
  },
  get: (path) => {
    console.log('API GET:', path);
    return fetch(path, { headers: getHeaders() }).then(handleResponse);
  },
  post: (path, data) => {
    console.log('API POST:', path, data);
    return fetch(path, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  put: (path, data) => {
    console.log('API PUT:', path, data);
    return fetch(path, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  delete: (path) => {
    console.log('API DELETE:', path);
    return fetch(path, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse);
  },
};