export const VALID_CATEGORIES = ['tech', 'finance', 'lifestyle'];

export function validatePostInput(args) {
  if (!args.title || typeof args.title !== 'string') return 'title is required';
  if (args.title.trim().length < 5) return 'title must be at least 5 characters';
  if (!args.author || typeof args.author !== 'string') return 'author is required';
  if (args.author.trim().length < 3) return 'author must be at least 3 characters';
  if (!args.category || typeof args.category !== 'string') return 'category is required';
  if (!VALID_CATEGORIES.includes(args.category)) return 'Invalid category';
  if (!args.body || typeof args.body !== 'string') return 'body is required';
  if (args.body.trim().length < 50) return 'body must be at least 50 characters';
  return null;
}
