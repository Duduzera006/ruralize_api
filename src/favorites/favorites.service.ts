import { Injectable, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { CollectionReference, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FavoritesService implements OnModuleInit {
  private db: Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getFavoritesCollection(buyerId: string): CollectionReference {
    return this.db.collection('buyers').doc(buyerId).collection('favorites');
  }

  async add(dto: CreateFavoriteDto) {
    const { buyerId, ...data } = dto;
    const favoritesColl = this.getFavoritesCollection(buyerId);

    // Usar o ID do produto como ID do documento para evitar duplicatas
    const docRef = favoritesColl.doc(data.productId);
    await docRef.set({
      ...data,
      addedAt: new Date(),
    });

    return { success: true, ...data };
  }

  async findAll(buyerId: string) {
    const snapshot = await this.getFavoritesCollection(buyerId).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async remove(buyerId: string, productId: string) {
    await this.getFavoritesCollection(buyerId).doc(productId).delete();
    return { success: true };
  }
}
