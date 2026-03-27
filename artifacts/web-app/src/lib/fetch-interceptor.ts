/**
 * Intercepts all window.fetch calls to automatically inject the Bearer token
 * and prepend the BASE_URL to API requests, ensuring seamless operation across
 * different base paths and proxy setups.
 */
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  let [resource, config] = args;

  let url = typeof resource === 'string'
    ? resource
    : resource instanceof URL
      ? resource.toString()
      : resource instanceof Request
        ? resource.url
        : '';

  const isApi = url.startsWith('/api/') || url.includes('/api/');

  if (isApi) {
    // Prepend BASE_URL if it's an absolute path starting with /api/
    if (url.startsWith('/api/')) {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      url = base + url;
    }

    const token = localStorage.getItem('auth_token');
    const headers = new Headers(
      resource instanceof Request ? resource.headers : config?.headers || {}
    );

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (resource instanceof Request) {
      resource = new Request(url, {
        ...resource,
        headers
      });
    } else {
      resource = url;
      config = { ...config, headers };
    }
  }

  return originalFetch(resource, config);
};
