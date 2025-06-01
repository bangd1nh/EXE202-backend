import express from "express";
import {
    getAllPhotographers,
    getServiceByPhotographersId,
    updatePhotographerProfile,
    uploadImageForPhotographer,
} from "../service/photographers/index.js";
import { getPhotographerProfile } from "../service/user/index.js";

const photographers = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

photographers.get("/", async (req, res) => {
    const result = await getAllPhotographers();
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

photographers.get("/:photographerId", async (req, res) => {
    const { photographerId } = req.params;
    const result = await getPhotographerProfile(photographerId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

photographers.get("/services/:photographerId", async (req, res) => {
    const { photographerId } = req.params;
    const result = await getServiceByPhotographersId(photographerId);

    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

photographers.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await getPhotographerProfile(userId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

photographers.put("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const { experienceYear, location, device, desc } = req.body;
    const result = await updatePhotographerProfile(
        userId,
        experienceYear,
        location,
        device,
        desc
    );
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

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

export default photographers;
