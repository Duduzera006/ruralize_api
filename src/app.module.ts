import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { FirebaseModule } from '../firebase/firebase.module.js';
import { ProductsModule } from './products/products.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [AuthModule, FirebaseModule, ProductsModule, CloudinaryModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
