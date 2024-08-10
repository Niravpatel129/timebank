const { ipcRenderer } = window.require('electron');

const makeRequest = async (method, url, data = null, options = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8004'
        : 'https://timebank-305bb7cb7d96.herokuapp.com';

    const requestOptions = {
      method,
      url: `${baseUrl}${url}`,
      ...(data && { data }),
      headers,
      timeout: 10000, // 10 seconds
      withCredentials: true,
      ...options,
    };

    const response = await ipcRenderer.invoke('make-request', requestOptions);
    console.log('🚀  response:', response);
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

const newRequest = {
  get: (url, options) => makeRequest('GET', url, null, options),
  post: (url, data, options) => makeRequest('POST', url, data, options),
  put: (url, data, options) => makeRequest('PUT', url, data, options),
  delete: (url, options) => makeRequest('DELETE', url, null, options),
  // Add other methods as needed
};

export default newRequest;
