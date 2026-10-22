export function validateCommentInput(args) {
  if (!args.text || typeof args.text !== 'string') return 'text is required';
  if (args.text.trim().length < 10) return 'text must be at least 10 characters';
  if (!args.commenter || typeof args.commenter !== 'string') return 'commenter is required';
  return null;
}
