import { Injectable, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { CollectionReference, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class ReviewsService implements OnModuleInit {
  private db: Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getReviewsCollection(empresaId: string, productId: string): CollectionReference {
    return this.db
      .collection('users')
      .doc(empresaId)
      .collection('products')
      .doc(productId)
      .collection('reviews');
  }

  async create(dto: CreateReviewDto) {
    const { empresaId, productId, ...data } = dto;
    const reviewsColl = this.getReviewsCollection(empresaId, productId);

    const reviewData = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await reviewsColl.add(reviewData);
    const snapshot = await docRef.get();

    return { id: snapshot.id, ...snapshot.data() };
  }

  async findAllByProduct(empresaId: string, productId: string) {
    const snapshot = await this.getReviewsCollection(empresaId, productId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getAverageRating(empresaId: string, productId: string) {
    const snapshot = await this.getReviewsCollection(empresaId, productId).get();
    if (snapshot.empty) return { average: 0, total: 0 };

    let sum = 0;
    snapshot.forEach((doc) => {
      sum += (doc.data().rating as number) || 0;
    });

    return {
      average: Number((sum / snapshot.size).toFixed(1)),
      total: snapshot.size,
    };
  }
}
