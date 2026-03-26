import { Injectable, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CollectionReference, DocumentData, Firestore, UpdateData } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService implements OnModuleInit {
  private db: Firestore;
  private userProducts: CollectionReference;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getUserProductsCollection(userId: string) {
    return this.db.collection('users').doc(userId).collection('products');
  }

  async create(dto: CreateProductDto) {
    const { empresaId, fotos, ...data } = dto;
    this.userProducts = this.getUserProductsCollection(empresaId);
    const productData = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await this.userProducts.add(productData);
    const docSnapshot = await docRef.get();

    return { id: docSnapshot.id, ...docSnapshot.data() };
  }

  async getAllProducts() {
    const snapshot = await this.db.collectionGroup('products').get();
    if (snapshot.empty) return [];

    const allProducts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const pathSegments = doc.ref.path.split('/');
      const empresaId = pathSegments[1];

      return {
        id: doc.id,
        empresaId,
        ...data,
      };
    });

    return allProducts;
  }

  async getTotalSales(empresaId: string) {
    const docRef = this.db.collection('users').doc(empresaId).collection('products');
    const doc = await docRef.get();
    let totalSales = 0;
    if (doc.size === 0) {
      throw new NotFoundException('Nenhum produto encontrado.');
    }
    for (let index = 0; index < doc.size; index++) {
      const element = doc[index];
      const saleValue = element.preco;
      totalSales += saleValue;
    }
    return totalSales;
  }

  async getProductById(empresaId: string, productId: string) {
    const docRef = this.db.collection('users').doc(empresaId).collection('products').doc(productId);

    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return {
      id: doc.id,
      empresaId,
      ...doc.data(),
    };
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

    const plain = JSON.parse(JSON.stringify(dto || {}));
    const cleaned = Object.fromEntries(Object.entries(plain).filter(([, v]) => v !== undefined));

    await docRef.set(cleaned as UpdateData<DocumentData>, { merge: true });
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

  async uploadProductImage(empresaId: string, produtoId: string, file: Express.Multer.File) {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file, {
        folder: `users/${empresaId}/products/${produtoId}`,
        public_id: uuidv4(),
      });

      const userProducts = this.getUserProductsCollection(empresaId);
      const docRef = userProducts.doc(produtoId);
      const doc = await docRef.get();
      if (!doc.exists) throw new NotFoundException('Produto não encontrado');

      const data = doc.data() || {};
      const fotos = Array.isArray(data.fotos) ? data.fotos : [];
      fotos.push(uploadResult.secure_url);
      await docRef.update({ fotos });

      return { message: 'Upload realizado com sucesso', image_url: uploadResult.secure_url };
    } catch (error) {
      console.error('ERRO CLOUDINARY DETALHADO:', error);

      throw new BadRequestException(
        `Erro no processamento da imagem: ${error.message || 'Erro desconhecido'}`,
      );
    }
  }
}
