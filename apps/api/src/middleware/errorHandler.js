export function notFound(req, res) {
  return res.status(404).json({ error: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  if (status >= 500) console.error(err);
  return res.status(status).json({ error: message });
}
