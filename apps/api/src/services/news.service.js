import mongoose from 'mongoose';
import News from '../models/News.js';
import Comment from '../models/Comment.js';
import { HttpError } from '../utils/HttpError.js';
import { validateNews } from '../validations/news.validation.js';

export async function createNews(body) {
    const v = validateNews(body);
    if (!v.ok) throw new HttpError(400, v.msg);

    return News.create({
        title: body.title.trim(),
        author: body.author.trim(),
        category: body.category.trim(),
        body: body.body.trim(),
    });
}

export async function listNews() {
    return News.find().sort({ createdAt: -1 });
}

export function findNewsById(id) {
    // 24 len of the mongo id  _id : ObjectId("87654345678876543")
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return News.findById(id);
}

export async function getNewsOrThrow(id) {
    const news = await findNewsById(id);
    if (!news) throw new HttpError(404, 'News not found');
    return news;
}

export async function updateNews(id, body) {
    const news = await getNewsOrThrow(id);
    const v = validateNews(body);
    if (!v.ok) throw new HttpError(400, v.msg);
    Object.assign(news, {
        title: body.title.trim(),
        author: body.author.trim(),
        category: body.category.trim(),
        body: body.body.trim(),
    });
    await news.save();
    return news;
}

export async function deleteNews(id) {
    const news = await News.findByIdAndDelete(id);
    if (!news) throw new HttpError(404, 'News not found');
    await Comment.deleteMany({ newsId: id });
    return { message: 'News deleted' };
}
