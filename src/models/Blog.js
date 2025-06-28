import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  CoverImage: {
    type: String, 
    required: false,
  },
  ContentHTML: {
    type: String, 
    required: true,
  },
  AuthorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  Tags: {
    type: [String],
    default: [],
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  UpdatedAt: {
    type: Date,
    default: Date.now,
  },
  IsPublished: {
    type: Boolean,
    default: false,
  }
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;