import * as commentService from '../services/comment.service.js';

export async function create(req, res) {
  const comment = await commentService.createComment(req.params.id, req.body);
  return res.status(201).json(comment);
}

export async function list(req, res) {
  const comments = await commentService.listComments(req.params.id);
  return res.json(comments);
}
