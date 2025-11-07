import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service.js';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CollectionReference, DocumentData, Firestore, UpdateData } from 'firebase-admin/firestore';

@Injectable()
export class ProductsService implements OnModuleInit {
  private db: Firestore;
  private userProducts: CollectionReference;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getUserProductsCollection(userId: string) {
    return this.db.collection('users').doc(userId).collection('products');
  }

  async create(dto: CreateProductDto) {
    const { empresaId, ...data } = dto;
    this.userProducts = this.getUserProductsCollection(empresaId);
    const productData = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await this.userProducts.add(productData);
    const docSnapshot = await docRef.get();
    return { id: docSnapshot.id, ...docSnapshot.data() };
  }

  async findAll(empresaId: string) {
    this.userProducts = this.getUserProductsCollection(empresaId);
    const snapshot = await this.userProducts.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async findOne(empresaId: string, produtoId: string) {
    this.userProducts = this.getUserProductsCollection(empresaId);
    const doc = await this.userProducts.doc(produtoId).get();
    if (!doc.exists) {
      throw new NotFoundException('Produto não encontrado');
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(empresaId: string, produtoId: string, dto: UpdateProductDto) {
    const userProducts = this.getUserProductsCollection(empresaId);
    const docRef = userProducts.doc(produtoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Produto não encontrado');
    }

    await docRef.update(dto as UpdateData<DocumentData>);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  async remove(empresaId: string, produtoId: string) {
    const userProducts = this.getUserProductsCollection(empresaId);
    const docRef = userProducts.doc(produtoId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Produto não encontrado');
    }

    await docRef.delete();
    return { message: 'Produto removido com sucesso' };
  }
}
