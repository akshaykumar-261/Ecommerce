import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
