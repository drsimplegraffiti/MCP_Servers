import { z } from 'zod';
import { api } from '../client/apiClient.js';
import { textResult } from '../utils/textResult.js';
import { validatePostInput, VALID_CATEGORIES } from '../validators/post.validator.js';

export function registerPostTools(server) {
  server.registerTool(
    'create_post',
    {
      description:
        'Create a new post. Validates: title (min 5), author (min 3), category (tech|finance|lifestyle), body (min 50 chars).',
      inputSchema: {
        title: z.string().min(5).describe('Post title, min 5 characters'),
        author: z.string().min(3).describe('Author name, min 3 characters'),
        category: z.enum(VALID_CATEGORIES).describe('Category'),
        body: z.string().min(50).describe('Post body, min 50 characters'),
      },
    },
    async (args) => {
      const err = validatePostInput(args);
      if (err) throw new Error(err);
      const post = await api('POST', '/posts', {
        title: args.title.trim(),
        author: args.author.trim(),
        category: args.category,
        body: args.body.trim(),
      });
      return textResult(post);
    }
  );

  server.registerTool(
    'list_posts',
    {
      description: 'List all posts from the API.',
      inputSchema: {},
    },
    async () => {
      const posts = await api('GET', '/posts');
      return textResult(posts);
    }
  );

  server.registerTool(
    'get_post',
    {
      description: 'Get a single post by ID. Returns 404 if not found.',
      inputSchema: {
        postId: z.string().describe('MongoDB ObjectId of the post'),
      },
    },
    async (args) => {
      const post = await api('GET', `/posts/${args.postId}`);
      return textResult(post);
    }
  );

  server.registerTool(
    'update_post',
    {
      description:
        'Update an existing post. Same validation as create_post. Returns 404 if post not found.',
      inputSchema: {
        postId: z.string().describe('MongoDB ObjectId of the post'),
        title: z.string().min(5).describe('Post title, min 5 characters'),
        author: z.string().min(3).describe('Author name, min 3 characters'),
        category: z.enum(VALID_CATEGORIES).describe('Category'),
        body: z.string().min(50).describe('Post body, min 50 characters'),
      },
    },
    async (args) => {
      const err = validatePostInput(args);
      if (err) throw new Error(err);
      const post = await api('PUT', `/posts/${args.postId}`, {
        title: args.title.trim(),
        author: args.author.trim(),
        category: args.category,
        body: args.body.trim(),
      });
      return textResult(post);
    }
  );

  server.registerTool(
    'delete_post',
    {
      description: 'Delete a post by ID. Also deletes its comments. Returns 404 if post not found.',
      inputSchema: {
        postId: z.string().describe('MongoDB ObjectId of the post'),
      },
    },
    async (args) => {
      const result = await api('DELETE', `/posts/${args.postId}`);
      return textResult(result);
    }
  );
}
