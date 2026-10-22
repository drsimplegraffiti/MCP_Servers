import Comment from '../models/Comment.js';
import { HttpError } from '../utils/HttpError.js';
import { validateComment } from '../validations/comment.validation.js';
import { getPostOrThrow } from './post.service.js';

export async function createComment(postId, body) {
  const post = await getPostOrThrow(postId);
  const v = validateComment(body);
  if (!v.ok) throw new HttpError(400, v.msg);
  return Comment.create({
    postId: post._id,
    text: body.text.trim(),
    commenter: body.commenter.trim(),
  });
}

export async function listComments(postId) {
  await getPostOrThrow(postId);
  return Comment.find({ postId }).sort({ createdAt: -1 });
}
