import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { FirebaseModule } from '../../firebase/firebase.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [FirebaseModule, NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
