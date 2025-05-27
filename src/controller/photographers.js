import express from "express";
import { getAllPhotographers } from "../service/photographers/index.js";

const photographers = express.Router();

photographers.get("/", async (req, res) => {
    const result = await getAllPhotographers();
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

export default photographers;
