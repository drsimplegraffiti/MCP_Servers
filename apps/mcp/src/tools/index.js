import { registerNewsTools } from './news.tools.js';
import { registerCommentTools } from './comment.tools.js';

export function registerTools(server) {
  registerNewsTools(server);
  registerCommentTools(server);
}
