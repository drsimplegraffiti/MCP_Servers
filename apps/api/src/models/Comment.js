import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  text: { type: String, required: true },
  commenter: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', commentSchema);
