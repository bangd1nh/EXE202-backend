import express from "express";
import { getUserById } from "../service/user/index.js";

const user = express.Router();

user.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const result = await getUserById(userId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

export default user;
