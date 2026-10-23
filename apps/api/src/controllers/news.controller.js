import * as newsService from '../services/news.service.js';

export async function create(req, res) {
  const news = await newsService.createNews(req.body);
  return res.status(201).json(news);
}

export async function list(req, res) {
  const news = await newsService.listNews();
  return res.json(news);
}

export async function get(req, res) {
  const news = await newsService.getNewsOrThrow(req.params.id);
  return res.json(news);
}

export async function update(req, res) {
  const news = await newsService.updateNews(req.params.id, req.body);
  return res.json(news);
}

export async function remove(req, res) {
  const result = await newsService.deleteNews(req.params.id);
  return res.json(result);
}
