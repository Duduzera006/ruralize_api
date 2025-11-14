import * as multer from 'multer';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UploadController } from './upload.controller';
import { FirebaseModule } from '../../firebase/firebase.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

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
