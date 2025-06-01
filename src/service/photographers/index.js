import PhotographerProfile from "../../models/PhotographerProfile.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Photographs from "../../models/Photographs.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const dataResponse = (code, message, payload) => {
    return {
        code: code,
        message: message,
        payload: payload,
    };
};

export const getAllPhotographers = async () => {
    const photographers = await PhotographerProfile.find()
        .populate(
            "PhotographerId",
            "Email FirstName LastName PhoneNumber Avatar Username"
        )
        .populate("PhotoGraphs");
    return dataResponse(200, "success", photographers);
};

export const getServiceByPhotographersId = async (photographerId) => {
    const service = await PhotographerProfile.findById(photographerId)
        .select("Services -_id")
        .populate("Services");
    if (!service) {
        return dataResponse(404, "not found", null);
    }
    return dataResponse(200, "found", service);
};

export const getPhotographerProfileByUserId = async (userId) => {
    const userProfile = await PhotographerProfile.findOne({
        PhotographerId: userId,
    })
        .populate("PhotoGraphs")
        .populate("Services");
    if (!userProfile) {
        return dataResponse(404, "not found", null);
    }
    return dataResponse(200, "success", userProfile);
};

export const updatePhotographerProfile = async (
    userId,
    expY,
    location,
    device,
    description
) => {
    const userProfile = await PhotographerProfile.findOneAndUpdate(
        {
            PhotographerId: userId,
        },
        {
            ExperienceYear: expY,
            Location: location,
            Device: device,
            Description: description,
        },
        { new: true }
    );
    if (!userProfile) {
        return dataResponse(404, "not found user", null);
    }
    return dataResponse(200, "success", userProfile);
};

export const uploadImageForPhotographer = async (file, userId) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: "photographer_images" },
            async (error, uploadResult) => {
                if (error) {
                    console.error("Cloudinary error:", error);
                    return reject(dataResponse(500, error.message, null));
                }
                try {
                    const photographer = await PhotographerProfile.findOne({
                        PhotographerId: userId,
                    });
                    await Photographs.findByIdAndUpdate(
                        photographer.PhotoGraphs,
                        { $push: { imgUrl: uploadResult.url } },
                        { new: true }
                    );
                    resolve(dataResponse(200, "sucess", uploadResult.url));
                } catch (dbError) {
                    console.error("Database update error:", dbError);
                    reject(dataResponse(500, dbError.message, null));
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};
