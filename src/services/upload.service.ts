import { CloudinaryService } from "./cloudinary.service";
import { ImageService } from "./image.service";
import { AppError } from "../middleware/error.middleware";

export class UploadService {
  static async uploadImage(file: Express.Multer.File, options: {
    folder?: string;
    userId?: string;
  } = {}) {
    try {
      // Validate image
      ImageService.validateImage(file);

      // Process image (compress if needed)
      const processedBuffer = await ImageService.processImage(file.buffer, file.size);

      // Generate public_id with user context
      const publicId = options.userId 
        ? `${options.userId}_${Date.now()}`
        : `upload_${Date.now()}`;

      // Upload to Cloudinary
      const result = await CloudinaryService.uploadImage(processedBuffer, {
        folder: options.folder || "easevote/uploads",
        public_id: publicId,
      }) as any;

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Upload failed", 500);
    }
  }

  static async deleteImage(publicId: string) {
    return await CloudinaryService.deleteImage(publicId);
  }
}