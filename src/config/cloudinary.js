import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

// Upload ảnh với watermark và giữ chất lượng cao
export const uploadImageWatermark = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Buffer)) {
      return reject(new Error("file buffer is not valid."));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "booking_demo",
        transformation: [
          {
            quality: "auto:best",
          },
          {
            overlay: process.env.CLOUDINARY_WATERMARK,
            gravity: "south_east",
            opacity: 60,
            width: 100,
            crop: "scale",
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file).pipe(stream);
  });
};

export default cloudinary;
