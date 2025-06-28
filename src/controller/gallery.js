import express from "express";
import multer from "multer";
import {
    addCategory,
    getAllGaleryName,
    uploadImageToCategory,
} from "../service/galery/index.js";
import Galery from "../models/gallery.js";

const gallery = express.Router();
const upload = multer(); // dùng bộ nhớ RAM, nếu muốn lưu file thì cấu hình thêm

gallery.get("/getAllCategoryName", async (req, res) => {
    const result = await getAllGaleryName();
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

gallery.post("/addCategory", async (req, res) => {
    const { categoryName } = req.body;
    const result = await addCategory(categoryName);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

// SỬA: dùng upload.single("image") để nhận file
gallery.post("/addImageToGallery", upload.single("image"), async (req, res) => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const { categoryId } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
        return res.status(400).json({ message: "No image file uploaded" });
    }
    try {
        const result = await uploadImageToCategory(imageFile, categoryId);
        res.status(result.code).json({
            message: result.message,
            payload: result.payload,
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});

gallery.get("/getGalleryByCategory/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    try {
        // Tìm gallery theo categoryId
        const gallery = await Galery.findOne({ galeryCategory: categoryId });
        if (!gallery) {
            return res.status(404).json({
                message: "Gallery not found for this category",
                payload: [],
            });
        }
        res.status(200).json({
            message: "Success",
            payload: gallery.galery,
        });
    } catch (err) {
        console.error("Get images error:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});

export default gallery;
