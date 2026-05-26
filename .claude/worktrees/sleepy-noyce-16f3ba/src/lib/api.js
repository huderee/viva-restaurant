// src/lib/api.js

const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token') && {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Серверийн алдаа гарлаа');
  }
  return res.json();
};

const api = {
  get: (url) =>
    fetch(`${BASE_URL}${url}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  post: (url, body) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (url, body) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (url) =>
    fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
};

export default api;