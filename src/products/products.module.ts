import * as multer from 'multer';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { UploadController } from './upload.controller.js';
import { FirebaseModule } from '../firebase/firebase.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [
    FirebaseModule,
    CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [ProductsController, UploadController],
  providers: [ProductsService],
})
export class ProductsModule {}
