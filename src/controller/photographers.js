import express from "express";
import multer from "multer";
import asyncHandler from "../middleware/index.js"
import ApiResponse from "../utils/apiResponse.js";

import {
    getAllPhotographers,
    getServiceByPhotographersId,
    updatePhotographerProfile,
    uploadImageForPhotographer,
    createServiceForPhotographer,
} from "../service/photographers/index.js";
import {
    getPhotographerProfile,
    getPhotographerProfile1,
} from "../service/user/index.js";

const photographers = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");


photographers.get("/", asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllPhotographers(page, limit);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
        total: result.total,
        page,
        limit,
    });
}));


photographers.get("/:photographerId", asyncHandler(async (req, res) => {
    const { photographerId } = req.params;
    const result = await getPhotographerProfile(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));

photographers.get("/services/:photographerId", asyncHandler(async (req, res) => {
    const { photographerId } = req.params;
    const result = await getServiceByPhotographersId(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));


photographers.get("/user/:userId", asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await getPhotographerProfile1(userId);
    console.log({ result });
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));


photographers.put("/user/:userId", asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { experienceYear, location, device, desc, price, services } = req.body;
    const result = await updatePhotographerProfile(
        userId,
        experienceYear,
        location,
        device,
        desc,
        price,
        services
    );
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
}));


photographers.post("/user/uploadImage/:userId", upload, async (req, res) => {
    const { userId } = req.params;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {
        const result = await uploadImageForPhotographer(file, userId);
        console.log("Upload success:", result);
        return res.status(result.code).json(result);
    } catch (error) {
        console.error("Upload error:", error);
        return res
            .status(500)
            .json({ message: "Error uploading image", error: error.message });
    }
});


photographers.post("/:photographerId/services", asyncHandler(async (req, res) => {
    const { photographerId } = req.params;
    const { name, description, price } = req.body;

    if (!name || !description || price === undefined) {
        return ApiResponse.error(
            res,
            400,
            "Service name, description, and price are required"
        );
    }

    const newService = await createServiceForPhotographer(photographerId, {
        name,
        description,
        price,
    });

    return ApiResponse.created(res, newService);
}));

export default photographers;
