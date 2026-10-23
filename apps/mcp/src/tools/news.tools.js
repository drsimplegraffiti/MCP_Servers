import { z } from 'zod';
import { api } from '../client/apiClient.js';
import { textResult } from '../utils/textResult.js';
import { validateNewsInput, VALID_CATEGORIES } from '../validators/news.validator.js';

export function registerNewsTools(server) {
    server.registerTool(
        'create_news',
        {
            description:
                'Create a new news. Validates: title (min 5), author (min 3), category (tech|finance|lifestyle), body (min 50 chars).',
            inputSchema: {
                title: z.string().min(5).describe('News title, min 5 characters'),
                author: z.string().min(3).describe('Author name, min 3 characters'),
                category: z.enum(VALID_CATEGORIES).describe('Category'),
                body: z.string().min(50).describe('News body, min 50 characters'),
            },
        },
        async (args) => {
            const err = validateNewsInput(args);
            if (err) throw new Error(err);

            // wire DB connection --> external tool
            // but we want to separate the logic from the DAL
            const news = await api('POST', '/news', {
                title: args.title.trim(),
                author: args.author.trim(),
                category: args.category,
                body: args.body.trim(),
            });
            return textResult(news);
        }
    );

    server.registerTool(
        'list_news',
        {
            description: 'List all news from the API.',
            inputSchema: {},
        },
        async () => {
            const news = await api('GET', '/news');
            return textResult(news);
        }
    );

    server.registerTool(
        'get_news',
        {
            description: 'Get a single news by ID. Returns 404 if not found.',
            inputSchema: {
                newsId: z.string().describe('MongoDB ObjectId of the news'),
            },
        },
        async (args) => {
            const news = await api('GET', `/news/${args.newsId}`);
            return textResult(news);
        }
    );

    server.registerTool(
        'update_news',
        {
            description:
                'Update an existing news. Same validation as create_news. Returns 404 if news not found.',
            inputSchema: {
                newsId: z.string().describe('MongoDB ObjectId of the news'),
                title: z.string().min(5).describe('News title, min 5 characters'),
                author: z.string().min(3).describe('Author name, min 3 characters'),
                category: z.enum(VALID_CATEGORIES).describe('Category'),
                body: z.string().min(50).describe('News body, min 50 characters'),
            },
        },
        async (args) => {
            const err = validateNewsInput(args);
            if (err) throw new Error(err);
            const news = await api('PUT', `/news/${args.newsId}`, {
                title: args.title.trim(),
                author: args.author.trim(),
                category: args.category,
                body: args.body.trim(),
            });
            return textResult(news);
        }
    );

    server.registerTool(
        'delete_news',
        {
            description: 'Delete a news by ID. Also deletes its comments. Returns 404 if news not found.',
            inputSchema: {
                newsId: z.string().describe('MongoDB ObjectId of the news'),
            },
        },
        async (args) => {
            const result = await api('DELETE', `/news/${args.newsId}`);
            return textResult(result);
        }
    );
}
