import config from '../config/index.js';
import { logDataFlow } from '../utils/logger.js';

export async function api(method, path, body) {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`;
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body && (method === 'POST' || method === 'PUT')) opts.body = JSON.stringify(body);

  const started = Date.now();
  logDataFlow('mcp→api', 'request', { method, path, payload: body });

  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  const durationMs = Date.now() - started;

  if (!res.ok) {
    const msg = data.error || res.statusText || `HTTP ${res.status}`;
    logDataFlow('mcp←api', 'response', { status: res.status, durationMs, error: msg });
    throw new Error(msg);
  }
  logDataFlow('mcp←api', 'response', { status: res.status, durationMs, result: data });
  return data;
}
