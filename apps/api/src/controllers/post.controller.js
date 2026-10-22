import * as postService from '../services/post.service.js';

export async function create(req, res) {
  const post = await postService.createPost(req.body);
  return res.status(201).json(post);
}

export async function list(req, res) {
  const posts = await postService.listPosts();
  return res.json(posts);
}

export async function get(req, res) {
  const post = await postService.getPostOrThrow(req.params.id);
  return res.json(post);
}

export async function update(req, res) {
  const post = await postService.updatePost(req.params.id, req.body);
  return res.json(post);
}

export async function remove(req, res) {
  const result = await postService.deletePost(req.params.id);
  return res.json(result);
}
