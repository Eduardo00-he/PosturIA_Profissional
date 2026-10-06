const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export async function apiFetch(input, init = {}) {
  const method = String(init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers ?? {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (!SAFE_METHODS.has(method)) {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      headers.set('X-CSRF-TOKEN', token);
    }
  }

  return fetch(input, {
    ...init,
    credentials: 'same-origin',
    headers,
  });
}
