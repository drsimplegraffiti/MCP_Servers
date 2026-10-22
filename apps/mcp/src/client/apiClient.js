import config from '../config/index.js';

export async function api(method, path, body) {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`;
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body && (method === 'POST' || method === 'PUT')) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const msg = data.error || res.statusText || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
