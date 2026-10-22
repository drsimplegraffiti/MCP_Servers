export const VALID_CATEGORIES = ['tech', 'finance', 'lifestyle'];

export function validatePost(body) {
  if (!body.title || typeof body.title !== 'string') return { ok: false, msg: 'title is required' };
  if (body.title.trim().length < 5) return { ok: false, msg: 'title must be at least 5 characters' };
  if (!body.author || typeof body.author !== 'string') return { ok: false, msg: 'author is required' };
  if (body.author.trim().length < 3) return { ok: false, msg: 'author must be at least 3 characters' };
  if (!body.category || typeof body.category !== 'string') return { ok: false, msg: 'category is required' };
  if (!VALID_CATEGORIES.includes(body.category)) return { ok: false, msg: 'Invalid category' };
  if (!body.body || typeof body.body !== 'string') return { ok: false, msg: 'body is required' };
  if (body.body.trim().length < 50) return { ok: false, msg: 'body must be at least 50 characters' };
  return { ok: true };
}
