import { z } from 'zod';
import { api } from '../client/apiClient.js';
import { textResult } from '../utils/textResult.js';
import { validateCommentInput } from '../validators/comment.validator.js';

export function registerCommentTools(server) {
  server.registerTool(
    'add_comment',
    {
      description:
        'Add a comment to a news. Validates: text (min 10), commenter required. Returns 404 if news not found.',
      inputSchema: {
        newsId: z.string().describe('MongoDB ObjectId of the news'),
        text: z.string().min(10).describe('Comment text, min 10 characters'),
        commenter: z.string().describe('Commenter name'),
      },
    },
    async (args) => {
      const err = validateCommentInput(args);
      if (err) throw new Error(err);
      const comment = await api('POST', `/news/${args.newsId}/comments`, {
        text: args.text.trim(),
        commenter: args.commenter.trim(),
      });
      return textResult(comment);
    }
  );

  server.registerTool(
    'list_comments',
    {
      description: 'List all comments for a news. Returns 404 if news not found.',
      inputSchema: {
        newsId: z.string().describe('MongoDB ObjectId of the news'),
      },
    },
    async (args) => {
      const comments = await api('GET', `/news/${args.newsId}/comments`);
      return textResult(comments);
    }
  );
}
