import Comment from '../models/Comment.js';
import { HttpError } from '../utils/HttpError.js';
import { validateComment } from '../validations/comment.validation.js';
import { getNewsOrThrow } from './news.service.js';

export async function createComment(newsId, body) {
  const news = await getNewsOrThrow(newsId);
  const v = validateComment(body);
  if (!v.ok) throw new HttpError(400, v.msg);
  return Comment.create({
    newsId: news._id,
    text: body.text.trim(),
    commenter: body.commenter.trim(),
  });
}

export async function listComments(newsId) {
  await getNewsOrThrow(newsId);
  return Comment.find({ newsId }).sort({ createdAt: -1 });
}
