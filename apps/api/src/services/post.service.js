import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { HttpError } from '../utils/HttpError.js';
import { validatePost } from '../validations/post.validation.js';

export async function createPost(body) {
  const v = validatePost(body);
  if (!v.ok) throw new HttpError(400, v.msg);
  return Post.create({
    title: body.title.trim(),
    author: body.author.trim(),
    category: body.category.trim(),
    body: body.body.trim(),
  });
}

export async function listPosts() {
  return Post.find().sort({ createdAt: -1 });
}

export function findPostById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Post.findById(id);
}

export async function getPostOrThrow(id) {
  const post = await findPostById(id);
  if (!post) throw new HttpError(404, 'Post not found');
  return post;
}

export async function updatePost(id, body) {
  const post = await getPostOrThrow(id);
  const v = validatePost(body);
  if (!v.ok) throw new HttpError(400, v.msg);
  Object.assign(post, {
    title: body.title.trim(),
    author: body.author.trim(),
    category: body.category.trim(),
    body: body.body.trim(),
  });
  await post.save();
  return post;
}

export async function deletePost(id) {
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new HttpError(404, 'Post not found');
  await Comment.deleteMany({ postId: id });
  return { message: 'Post deleted' };
}
