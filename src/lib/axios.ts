import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Get CSRF token from Laravel Sanctum
export const getCsrfToken = async () => {
  try {
    // Karena kita tidak benar-benar membutuhkan CSRF untuk API token-based
    // Kita bisa skip bagian ini untuk sementara
    return Promise.resolve();
    
    // Jika nanti diperlukan, uncomment kode di bawah ini:
    /*
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
    */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Kita biarkan error ini karena tidak mempengaruhi fungsionalitas
    console.warn('CSRF token fetch skipped');
    return Promise.resolve();
  }
};

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
    return Promise.reject(error);
  }
);

export default api;