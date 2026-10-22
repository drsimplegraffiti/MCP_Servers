import { z } from 'zod';
import { api } from '../client/apiClient.js';
import { textResult } from '../utils/textResult.js';
import { validateCommentInput } from '../validators/comment.validator.js';

export function registerCommentTools(server) {
  server.registerTool(
    'add_comment',
    {
      description:
        'Add a comment to a post. Validates: text (min 10), commenter required. Returns 404 if post not found.',
      inputSchema: {
        postId: z.string().describe('MongoDB ObjectId of the post'),
        text: z.string().min(10).describe('Comment text, min 10 characters'),
        commenter: z.string().describe('Commenter name'),
      },
    },
    async (args) => {
      const err = validateCommentInput(args);
      if (err) throw new Error(err);
      const comment = await api('POST', `/posts/${args.postId}/comments`, {
        text: args.text.trim(),
        commenter: args.commenter.trim(),
      });
      return textResult(comment);
    }
  );

  server.registerTool(
    'list_comments',
    {
      description: 'List all comments for a post. Returns 404 if post not found.',
      inputSchema: {
        postId: z.string().describe('MongoDB ObjectId of the post'),
      },
    },
    async (args) => {
      const comments = await api('GET', `/posts/${args.postId}/comments`);
      return textResult(comments);
    }
  );
}
