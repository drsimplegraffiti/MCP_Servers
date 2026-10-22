import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true },
  commenter: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', commentSchema);
