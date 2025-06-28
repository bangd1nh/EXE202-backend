import blogService from "../service/blog.service.js";
import ApiResponse from "../utils/apiResponse.js";

const blogController = {
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await blogService.getAllBlogs();
      return ApiResponse.success(res, blogs);
    } catch (err) {
      return ApiResponse.error(res, 500, err.message);
    }
  },

  getBlogBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBlogBySlug(slug);
      if (!blog) return ApiResponse.notFound(res);
      return ApiResponse.success(res, blog);
    } catch (err) {
      return ApiResponse.error(res, 500, err.message);
    }
  },

  createBlog: async (req, res) => {
    try {
      const { file } = req; 
      const data = {
        ...req.body,
        Tags: req.body.Tags ? JSON.parse(req.body.Tags) : [],
        AuthorId: process.env.ADMIN_USER_ID || '68443d8a7fb1436049aea08e',
      };

      const blog = await blogService.createBlog(data, file);
      return ApiResponse.created(res, blog);
    } catch (err) {
      return ApiResponse.error(res, 500, err.message);
    }
  },

  updateBlogBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const { file } = req;

      const data = {
        ...req.body,
        Tags: req.body.Tags ? JSON.parse(req.body.Tags) : [],
      };

      const updated = await blogService.updateBlogBySlug(slug, data, file);
      if (!updated) return ApiResponse.notFound(res);
      return ApiResponse.success(res, updated);
    } catch (err) {
      return ApiResponse.error(res, 500, err.message);
    }
  },

  deleteBlogBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const deleted = await blogService.deleteBlogBySlug(slug);
      if (!deleted) return ApiResponse.notFound(res);
      return ApiResponse.success(res, { message: "Deleted successfully" });
    } catch (err) {
      return ApiResponse.error(res, 500, err.message);
    }
  },

  uploadSubImage: async (req, res) => {
    try {
      const file = req.file;
      if (!file || !file.buffer) {
        return ApiResponse.validationError(res, null, "No image uploaded");
      }
      const imageUrl = await blogService.uploadSubImage(file.buffer);
      return ApiResponse.success(res, { imageUrl });
    } catch (err) {
      return ApiResponse.error(res, 500, err.message);
    }
  },
};

export default blogController;
