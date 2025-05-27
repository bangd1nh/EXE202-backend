import User from "../../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

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

export const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return dataResponse(404, "not found user", null);
    }
    return dataResponse(200, "found user", user);
};

export const updateUserInfomation = async (
    userId,
    firsName,
    lastName,
    phoneNumber
) => {
    const user = await User.findByIdAndUpdate(userId, {
        FirstName: firsName,
        LastName: lastName,
        PhoneNumber: phoneNumber,
    });
    if (!user) {
        return dataResponse(404, "can not find this user", null);
    }
    return dataResponse(200, "update sucessfully", user);
};

export const uploadUserAvatar = async (file, userId) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            async (error, uploadResult) => {
                if (error) {
                    console.error("Cloudinary error:", error);
                    return reject(dataResponse(500, error.message, null));
                }
                try {
                    await User.findByIdAndUpdate(userId, {
                        Avatar: uploadResult.url,
                    });
                    resolve(dataResponse(200, "sucess", uploadResult));
                } catch (dbError) {
                    console.error("Database update error:", dbError);
                    reject(dataResponse(500, dbError.message, null));
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};
