import sharp from "sharp";
import { AppError } from "../middleware/error.middleware";

export class ImageService {
  static async processImage(buffer: Buffer, originalSize: number): Promise<Buffer> {
    try {
      // If file is less than 1MB, return as is
      if (originalSize < 1024 * 1024) {
        return buffer;
      }

      // Compress image if larger than 1MB
      let quality = 80;
      let processedBuffer = buffer;

      // Reduce quality until file is under reasonable size or quality is too low
      while (processedBuffer.length > 1024 * 1024 && quality > 20) {
        processedBuffer = await sharp(buffer)
          .jpeg({ quality, progressive: true })
          .png({ quality, progressive: true })
          .webp({ quality })
          .toBuffer();
        
        quality -= 10;
      }

      // Resize if still too large
      if (processedBuffer.length > 1024 * 1024) {
        processedBuffer = await sharp(buffer)
          .resize(1200, 1200, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 70 })
          .toBuffer();
      }

      return processedBuffer;
    } catch (error) {
      throw new AppError("Image processing failed", 500);
    }
  }

  static validateImage(file: Express.Multer.File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError("Only JPEG, PNG, and WebP images are allowed", 400);
    }

    if (file.size > maxSize) {
      throw new AppError("File size must be less than 5MB", 400);
    }
  }
}