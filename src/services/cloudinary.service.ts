import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../middleware/error.middleware";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  static async uploadImage(buffer: Buffer, options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}) {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: options.folder || "easevote",
            public_id: options.public_id,
            transformation: options.transformation,
          },
          (error, result) => {
            if (error) {
              reject(new AppError("Image upload failed", 500));
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      throw new AppError("Image upload failed", 500);
    }
  }

  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new AppError("Image deletion failed", 500);
    }
  }
}