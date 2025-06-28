import Blog from "../models/Blog.js";
import slugify from "slugify";
import { uploadImageWatermark } from "../config/cloudinary.js";

const blogService = {
  getAllBlogs: async () => {
    return await Blog.find({ IsPublished: true }).sort({ CreatedAt: -1 });
  },

  getBlogBySlug: async (slug) => {
    return await Blog.findOne({ Slug: slug });
  },

  createBlog: async (data, coverImageFile) => {
    const slug = slugify(data.Title, { lower: true });

    let coverImageUrl = '';
    if (coverImageFile && coverImageFile.buffer) {
      coverImageUrl = await uploadImageWatermark(coverImageFile.buffer);
    }

    const newBlog = new Blog({
      ...data,
      Slug: slug,
      CoverImage: coverImageUrl || '',
      IsPublished: true,
    });

    return await newBlog.save();
  },

  updateBlogBySlug: async (slug, data, coverImageFile) => {
    let coverImageUrl = '';

    if (coverImageFile && coverImageFile.buffer) {
      coverImageUrl = await uploadImageWatermark(coverImageFile.buffer);
    }

    const updateData = {
      ...data,
      UpdatedAt: new Date(),
    };

    if (coverImageUrl) {
      updateData.CoverImage = coverImageUrl;
    }

    return await Blog.findOneAndUpdate(
      { Slug: slug },
      updateData,
      { new: true }
    );
  },

  deleteBlogBySlug: async (slug) => {
    return await Blog.findOneAndDelete({ Slug: slug });
  },

  uploadSubImage: async (buffer) => {
    return await uploadImageWatermark(buffer);
  },
};

export default blogService;
