import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service.js';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CollectionReference, DocumentData, Firestore, UpdateData } from 'firebase-admin/firestore';

@Injectable()
export class ProductsService implements OnModuleInit {
  private productsCollection: CollectionReference;
  private db: Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
    this.productsCollection = this.db.collection('products');
  }

  async create(dto: CreateProductDto) {
    const productData = {
      ...dto,
      createdAt: new Date(),
    };

    const docRef = await this.productsCollection.add(productData);
    return { id: docRef.id, ...productData };
  }

  async findAll() {
    const snapshot = await this.productsCollection.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async findOne(id: string) {
    const doc = await this.productsCollection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Produto não encontrado');
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(id: string, dto: UpdateProductDto) {
    const docRef = this.productsCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Produto não encontrado');

    await docRef.update(dto as UpdateData<DocumentData>);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  async remove(id: string) {
    const docRef = this.productsCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Produto não encontrado');

    await docRef.delete();
    return { message: 'Produto removido com sucesso' };
  }
}
