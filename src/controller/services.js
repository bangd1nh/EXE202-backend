import express from "express";
import { getServiceByPhotographersId } from "../service/services/index.js";

const services = express.Router();

services.get("/:photographerId", async (req, res) => {
    const result = await getServiceByPhotographersId();
});

export default services;
