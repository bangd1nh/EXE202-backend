import GaleryCategory from "../../models/galerycategory.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Galery from "../../models/gallery.js";

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

export const getAllGaleryName = async () => {
    const result = await GaleryCategory.find();
    return dataResponse(200, "sucess", result);
};

export const addCategory = async (categoryName) => {
    const result = await GaleryCategory.create({
        galeryCategoryName: categoryName,
    });
    if (result) {
        return dataResponse(200, "Category added successfully", result);
    } else {
        return dataResponse(500, "Failed to add category", null);
    }
};

export const uploadImageToCategory = async (file, categoryId) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: "galery_category_images" },
            async (error, uploadResult) => {
                if (error) {
                    console.error("Cloudinary error:", error);
                    return reject(dataResponse(500, error.message, null));
                }

                try {
                    // Tìm gallery theo categoryId, nếu chưa có thì tạo mới
                    let gallery = await Galery.findOne({
                        galeryCategory: categoryId,
                    });
                    if (!gallery) {
                        gallery = await Galery.create({
                            galeryCategory: categoryId,
                            galery: [],
                        });
                    }

                    gallery.galery.push(uploadResult.url);
                    await gallery.save();

                    resolve(
                        dataResponse(
                            200,
                            "Image uploaded successfully",
                            uploadResult.url
                        )
                    );
                } catch (dbError) {
                    console.error("Database update error:", dbError);
                    reject(dataResponse(500, dbError.message, null));
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};
