import express from "express";
import {
    getAllPhotographers,
    getServiceByPhotographersId,
} from "../service/photographers/index.js";
import { getPhotographerProfile } from "../service/user/index.js";

const photographers = express.Router();

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

export default photographers;
