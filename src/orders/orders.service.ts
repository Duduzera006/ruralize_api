import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
    this.userOrders = this.getUserOrdersCollection(empresaId);
    const docRef = await this.userOrders.add({ ...data, createdAt: new Date() });
    const doc = await docRef.get();
    return { id: doc.id, empresaId, ...doc.data() };
  }

  async createMany(dtos: CreateOrderDto[]) {
    if (!Array.isArray(dtos) || dtos.length === 0) return [];

    const created = await Promise.all(
      dtos.map(async (dto) => {
        const { empresaId, ...data } = dto as any;
        const userOrders = this.getUserOrdersCollection(empresaId);
        const docRef = await userOrders.add({ ...data, createdAt: new Date() });
        const doc = await docRef.get();
        return { id: doc.id, empresaId, ...doc.data() };
      }),
    );

    return created;
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

    snapshot.forEach((doc) => {
      const data = doc.data();
      total += data.total;
    });

    return total;
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
