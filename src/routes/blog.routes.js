import express from "express";
import blogController from "../controller/blog.controller.js";
import upload from "../middleware/multer.js";
import { requireAuth } from "../middleware/index.js";

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/slug/:slug", blogController.getBlogBySlug);
router.post("/", upload.single('CoverImage'), blogController.createBlog);
router.put("/:slug", upload.single('CoverImage'), blogController.updateBlogBySlug);
router.delete("/:slug", blogController.deleteBlogBySlug);
router.post("/upload-sub-image", upload.single("image"), blogController.uploadSubImage);

export default router;