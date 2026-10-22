import { registerPostTools } from './post.tools.js';
import { registerCommentTools } from './comment.tools.js';

export function registerTools(server) {
  registerPostTools(server);
  registerCommentTools(server);
}
