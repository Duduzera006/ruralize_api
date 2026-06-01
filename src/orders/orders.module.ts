import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { FirebaseModule } from '../../firebase/firebase.module';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [FirebaseModule, NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
