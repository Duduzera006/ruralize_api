import { Injectable, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';
import { CollectionReference, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private db: Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getNotificationsCollection(empresaId: string): CollectionReference {
    return this.db.collection('users').doc(empresaId).collection('notifications');
  }

  async create(dto: CreateNotificationDto) {
    const { empresaId, ...data } = dto;
    const notificationsColl = this.getNotificationsCollection(empresaId);

    const notificationData = {
      ...data,
      lida: false,
      createdAt: new Date(),
    };

    const docRef = await notificationsColl.add(notificationData);
    const snapshot = await docRef.get();

    return { id: snapshot.id, ...snapshot.data() };
  }

  async findAll(empresaId: string) {
    const snapshot = await this.getNotificationsCollection(empresaId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async markAsRead(empresaId: string, notificationId: string) {
    const docRef = this.getNotificationsCollection(empresaId).doc(notificationId);
    await docRef.update({ lida: true });
    return { success: true };
  }

  async remove(empresaId: string, notificationId: string) {
    await this.getNotificationsCollection(empresaId).doc(notificationId).delete();
    return { success: true };
  }
}
