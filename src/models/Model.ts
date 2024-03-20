import mongoose from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  bio: String,
  portfolio: String,
  avatar: String,
  following: [String],
  followers: [String],
  bookmark: [],
});

const postSchema = new mongoose.Schema({
  content: String,
  likes: {
    likeCount: Number,
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "animverseUser" }],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "animverseUser",
    required: true,
  },
  comment: [{ username: String, img: String, content: String }],
  img: String,
  createdAt: Date,
  updatedAt: Date,
  firstName: String,
  username: String,
});

export const UserSchema = mongoose.model("animverseUser", userSchema);
export const PostSchema = mongoose.model("animversePost", postSchema);
