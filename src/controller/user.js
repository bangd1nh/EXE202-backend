import express from "express";
import {
    getUserById,
    updateUserInfomation,
    uploadUserAvatar,
} from "../service/user/index.js";
import multer from "multer";

const user = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

user.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    const result = await getUserById(userId);
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

user.put("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, phoneNumber } = req.body;
    const result = await updateUserInfomation(
        userId,
        firstName,
        lastName,
        phoneNumber
    );
    res.status(result.code).json({
        message: result.message,
        payload: result.payload,
    });
});

user.post("/uploadImage/:userId", upload, async (req, res) => {
    const { userId } = req.params;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {
        const result = await uploadUserAvatar(file, userId);
        console.log("Upload success:", result);
        return res.status(result.code).json(result);
    } catch (error) {
        console.error("Upload error:", error);
        return res
            .status(500)
            .json({ message: "Error uploading image", error: error.message });
    }
});

export default user;
