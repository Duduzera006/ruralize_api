import { Injectable, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CollectionReference, DocumentData, Firestore, UpdateData } from 'firebase-admin/firestore';

@Injectable()
export class OrdersService implements OnModuleInit {
  private db: Firestore;
  private userOrders: CollectionReference;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getUserOrdersCollection(userId: string) {
    return this.db.collection('users').doc(userId).collection('orders');
  }

  async create(dto: CreateOrderDto) {
    const { empresaId, ...data } = dto as any;

    const userProductsColl = this.db.collection('users').doc(empresaId).collection('products');
    const userOrdersColl = this.getUserOrdersCollection(empresaId);

    const result = await this.db.runTransaction(async (tx) => {
      for (const item of data.items || []) {
        const productRef = userProductsColl.doc(item.productId);
        const prodSnap = await tx.get(productRef);
        if (!prodSnap.exists) {
          throw new NotFoundException(
            `Produto ${item.productId} não encontrado para a empresa ${empresaId}`,
          );
        }

        const prodData = prodSnap.data() as any;
        const estoqueAtual = Number(prodData.estoque ?? 0);
        const quantidade = Number(item.quantidade ?? 0);

        if (estoqueAtual < quantidade) {
          throw new BadRequestException(`Estoque insuficiente para o produto ${item.productId}`);
        }

        await tx.update(productRef, { estoque: estoqueAtual - quantidade });
      }

      const orderRef = userOrdersColl.doc();
      const orderPayload = { ...data, createdAt: new Date() };
      await tx.set(orderRef, orderPayload);

      return { id: orderRef.id, empresaId, ...orderPayload };
    });

    return result;
  }

  async createMany(dtos: CreateOrderDto[]) {
    if (!Array.isArray(dtos) || dtos.length === 0) return [];

    const results = [] as any[];
    for (const dto of dtos) {
      const created = await this.create(dto);
      results.push(created);
    }

    return results;
  }

  async getAllOrders() {
    const snapshot = await this.db.collectionGroup('orders').get();
    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const pathSegments = doc.ref.path.split('/');
      const empresaId = pathSegments[1];

      return {
        id: doc.id,
        empresaId,
        ...data,
      };
    });
  }

  async getTotalSales(empresaId: string) {
    const snapshot = await this.db.collection('users').doc(empresaId).collection('orders').get();

    if (snapshot.empty) {
      return 0;
    }

    let total = 0;
    let orderProductQuantity = 0;
    let totalOrders = snapshot.size;

    snapshot.forEach((doc) => {
      const data = doc.data();
      total += data.total;
      if (Array.isArray(data.items)) {
        data.items.forEach((item) => {
          orderProductQuantity += item.quantidade;
        });
      }
    });

    return { total, totalOrders, orderProductQuantity };
  }

  async findAll(empresaId: string) {
    this.userOrders = this.getUserOrdersCollection(empresaId);
    const snapshot = await this.userOrders.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(empresaId: string, orderId: string) {
    const docRef = this.getUserOrdersCollection(empresaId).doc(orderId);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Pedido não encontrado');
    return { id: doc.id, ...doc.data() };
  }

  async update(empresaId: string, orderId: string, dto: UpdateOrderDto) {
    const userOrders = this.getUserOrdersCollection(empresaId);
    const docRef = userOrders.doc(orderId);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Pedido não encontrado');
    await docRef.set(dto as UpdateData<DocumentData>, { merge: true });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  }

  async remove(empresaId: string, orderId: string) {
    const userOrders = this.getUserOrdersCollection(empresaId);
    const docRef = userOrders.doc(orderId);
    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundException('Pedido não encontrado');
    await docRef.delete();
    return { message: 'Pedido removido com sucesso' };
  }
}
