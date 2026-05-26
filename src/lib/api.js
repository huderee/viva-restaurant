// VITE_API_URL тохируулсан бол тэрийг ашиглана. Production дээр rewrite deploy-д
// ороогүй байсан ч backend API руу шууд явуулж CORS allowlist-ээр зөвшөөрүүлнэ.
const API_BASE = import.meta.env.VITE_API_URL
  || (window.location.hostname.endsWith('.vercel.app')
    ? 'https://viva-restaurant-api.vercel.app/api'
    : '/api');

// Token-г хадгалах/авах
const getToken = () => localStorage.getItem('admin_token');
const setToken = (token) => {
  if (token) localStorage.setItem('admin_token', token);
  else localStorage.removeItem('admin_token');
};

// API wrapper
async function apiRequest(endpoint, options = {}, signal) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Хэрвэл token байвал Authorization header нэмнэ
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal,
    });

    // 401 бол token хүчинтэй биш — auth endpoint бус бол redirect-гүйгээр alqah
    if (res.status === 401) {
      const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
      if (!isAuthEndpoint) {
        setToken(null);
        // Зөвхөн nuhüt session-д зориулсан flag — App-ынхаа уйлчилгээний хэсэгт listen хийж болно
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Unauthorized');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.error('API Error:', err);
    throw err;
  }
}

export default {
  get: (endpoint, signal) => apiRequest(endpoint, { method: 'GET' }, signal),
  post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  setToken,
  getToken,
};
