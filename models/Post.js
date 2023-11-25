import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // обовязково
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    imageUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,   // Id з БД монго
      ref: 'User',                            // ссилатися на модель User по Id
      required: true,
    },
  },
  {
    timestamps: true, // дата створення
  }
);

export default mongoose.model('Post', PostSchema);