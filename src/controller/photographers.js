import express from "express";
import {
    getAllPhotographers,
    getServiceByPhotographersId,
    updatePhotographerProfile,
    uploadImageForPhotographer,
    createServiceForPhotographer
} from "../service/photographers/index.js";
import {
    getPhotographerProfile,
    getPhotographerProfile1,
} from "../service/user/index.js";
import multer from "multer";
import ApiResponse from "../utils/ApiResponse.js";

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
    const result = await getPhotographerProfile1(userId);
    console.log({result});
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

photographers.post('/:photographerId/services', async (req, res) => {
  try {
    const { photographerId } = req.params; 
    const { name, description, price } = req.body; 

   
    if (!name || !description || price === undefined) {
      return ApiResponse.error(res, 400, "Service name, description, and price are required");
    }

    const newService = await createServiceForPhotographer(photographerId, {
      name,
      description,
      price,
    });

    return ApiResponse.created(res, newService);
  } catch (err) {
    console.error(err);
    return ApiResponse.error(res, 500, err.message);
  }
});


export default photographers;
