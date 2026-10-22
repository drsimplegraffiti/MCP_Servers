export function validateComment(body) {
  if (!body.text || typeof body.text !== 'string') return { ok: false, msg: 'text is required' };
  if (body.text.trim().length < 10) return { ok: false, msg: 'text must be at least 10 characters' };
  if (!body.commenter || typeof body.commenter !== 'string') return { ok: false, msg: 'commenter is required' };
  return { ok: true };
}
