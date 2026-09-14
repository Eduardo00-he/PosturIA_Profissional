import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

window.apiFetch = (input, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();
    const headers = new Headers(init.headers || {});
    headers.set('Accept', 'application/json');
    headers.set('X-Requested-With', 'XMLHttpRequest');

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const token = document.querySelector('meta[name="csrf-token"]')?.content;
        if (token) headers.set('X-CSRF-TOKEN', token);
    }

    return fetch(input, {
        ...init,
        method,
        headers,
        credentials: 'same-origin',
    });
};
