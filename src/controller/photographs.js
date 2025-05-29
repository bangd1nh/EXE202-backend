import express from "express";
import { getImageByPhotographerId } from "../service/photographs/index.js";

const photographs = express.Router();

photographs.get("/:photographerId", async (req, res) => {
    const { photographerId } = req.params;
    const result = await getImageByPhotographerId(photographerId);
});

export default photographs;
