import { Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

interface UploadOptions {
  folder: string;
  public_id: string;
}

@Injectable()
export class CloudinaryService implements OnModuleInit {
  onModuleInit() {
    Cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    uploadOptions: UploadOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = Cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        if (result) resolve(result);
      });
      upload.end(file.buffer);
    });
  }
}
