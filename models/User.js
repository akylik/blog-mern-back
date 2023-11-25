import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // обовязково
    },
    email: {
      type: String,
      required: true,
      unique: true, // унікальне
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true, // дата створення
  }
);

export default mongoose.model('User', UserSchema);