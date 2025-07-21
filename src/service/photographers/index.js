import PhotographerProfile from "../../models/PhotographerProfile.js";
import Service from "../../models/Services.js";
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

export const getAllPhotographers = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [photographers, total] = await Promise.all([
        PhotographerProfile.find()
            .populate(
                "PhotographerId",
                "Email FirstName LastName PhoneNumber Avatar Username"
            )
            .populate("PhotoGraphs")
            .skip(skip)
            .limit(limit),
        PhotographerProfile.countDocuments(),
    ]);
    console.log({ photographers, total });
    return dataResponse(200, "success", { photographers, total });
};

export const getServiceByPhotographersId = async (photographerId) => {
    const service = await PhotographerProfile.findOne({ PhotographerId: photographerId })
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
    description,
    price,
    services // nhận thêm mảng service mới
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
            Price: price,
        },
        { new: true }
    );
    if (!userProfile) {
        return dataResponse(404, "not found user", null);
    }

    if (Array.isArray(services) && services.length > 0) {
        for (const s of services) {
            if (s.name && s.description && s.price !== undefined) {
                const newService = await Service.create({
                    Name: s.name,
                    Description: s.description,
                    Price: s.price,
                });
                userProfile.Services.push(newService._id);
            }
        }
        await userProfile.save();
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

                    if (!photographer) {
                        return reject(
                            dataResponse(404, "Photographer not found", null)
                        );
                    }

                    let photograph;
                    if (photographer.PhotoGraphs) {
                        photograph = await Photographs.findById(
                            photographer.PhotoGraphs
                        );
                    }

                    if (!photograph) {
                        photograph = new Photographs({
                            imgUrl: [uploadResult.url],
                        });
                        await photograph.save();
                    } else {
                        await Photographs.findByIdAndUpdate(
                            photograph._id,
                            { $push: { imgUrl: uploadResult.url } },
                            { new: true }
                        );
                    }

                    photographer.PhotoGraphs = photograph._id;
                    await photographer.save();

                    resolve(dataResponse(200, "Success", uploadResult.url));
                } catch (dbError) {
                    console.error("Database update error:", dbError);
                    reject(dataResponse(500, dbError.message, null));
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

export const createServiceForPhotographer = async (photographerId, data) => {
    const photographer = await PhotographerProfile.findOne({
        PhotographerId: photographerId,
    });
    if (!photographer) {
        throw new Error("Photographer not found");
    }
    const newService = await Service.create({
        Name: data.name,
        Description: data.description,
        Price: data.price,
    });

    // cập nhật vào PhotographerProfile
    photographer.Services.push(newService._id);
    await photographer.save();

    return newService;
};

export const createPhotographerProfile = async (userId) => {
    try {
        const existingProfile = await PhotographerProfile.findOne({
            PhotographerId: userId,
        });
        if (existingProfile) {
            return dataResponse(400, "Profile already exists", null);
        }

        const newProfile = await PhotographerProfile.create({
            PhotographerId: userId,
            ExperienceYear: 0,
            Location: "",
            Device: "",
            Description: "",
        });

        return dataResponse(201, "Profile created successfully", newProfile);
    } catch (error) {
        console.error("Error creating photographer profile:", error);
        return dataResponse(500, "Server error", null);
    }
};
