import { Injectable, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { CollectionReference, DocumentData, Firestore, UpdateData } from 'firebase-admin/firestore';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '../notifications/dto/create-notification.dto.js';

@Injectable()
export class OrdersService implements OnModuleInit {
  private db: Firestore;
  private userOrders: CollectionReference;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getUserOrdersCollection(userId: string) {
    return this.db.collection('users').doc(userId).collection('orders');
  }

  async create(dto: CreateOrderDto) {
    const { empresaId, ...data } = dto;

    const userProductsColl = this.db.collection('users').doc(empresaId).collection('products');
    const userOrdersColl = this.getUserOrdersCollection(empresaId);

    const lowStockAlerts: string[] = [];

    const result = await this.db.runTransaction(async (tx) => {
      for (const item of data.items || []) {
        const productRef = userProductsColl.doc(item.productId);
        const prodSnap = await tx.get(productRef);
        if (!prodSnap.exists) {
          throw new NotFoundException(
            `Produto ${item.productId} não encontrado para a empresa ${empresaId}`,
          );
        }

        const prodData = prodSnap.data() as DocumentData;
        const estoqueAtual = Number(prodData.estoque ?? 0);
        const quantidade = Number(item.quantidade ?? 0);
        const novoEstoque = estoqueAtual - quantidade;

        if (estoqueAtual < quantidade) {
          throw new BadRequestException(`Estoque insuficiente para o produto ${item.productId}`);
        }

        if (novoEstoque < 5) {
          lowStockAlerts.push((prodData.titulo as string) || item.productId);
        }

        tx.update(productRef, { estoque: novoEstoque });
      }

      const orderRef = userOrdersColl.doc();
      const orderPayload = {
        ...data,
        status: data.status || 'pending',
        createdAt: new Date(),
      };
      tx.set(orderRef, orderPayload);

      return { id: orderRef.id, empresaId, ...orderPayload };
    });

    // Trigger de Notificações
    try {
      // 1. Notificação In-App (Firestore)
      await this.notificationsService.create({
        empresaId,
        titulo: 'Nova Venda!',
        mensagem: `Você recebeu um novo pedido de R$ ${Number(data.total || 0).toFixed(2)}`,
        tipo: NotificationType.SUCESSO,
      });

      // 2. Notificação Push (FCM)
      const userDoc = await this.db.collection('users').doc(empresaId).get();
      const userData = userDoc.data();
      if (userData?.fcmToken) {
        await this.firebaseService.getMessaging().send({
          token: userData.fcmToken as string,
          notification: {
            title: 'Nova Venda Ruralize!',
            body: `Pedido #${result.id.substring(0, 6)} - Total: R$ ${Number(data.total || 0).toFixed(2)}`,
          },
          data: {
            orderId: result.id,
            empresaId: empresaId,
            type: 'NEW_ORDER',
          },
        });
      }

      for (const productTitle of lowStockAlerts) {
        await this.notificationsService.create({
          empresaId,
          titulo: 'Estoque Baixo!',
          mensagem: `O produto "${productTitle}" está com menos de 5 unidades em estoque.`,
          tipo: NotificationType.ALERTA,
        });
      }
    } catch (e) {
      console.error('Erro ao gerar notificações:', e);
    }

    return result;
  }

  async createMany(dtos: CreateOrderDto[]) {
    if (!Array.isArray(dtos) || dtos.length === 0) return [];

    const results: DocumentData[] = [];
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
    const totalOrders = snapshot.size;

    snapshot.forEach((doc) => {
      const data = doc.data();
      total += (data.total as number) || 0;
      if (Array.isArray(data.items)) {
        (data.items as { quantidade: number }[]).forEach((item) => {
          orderProductQuantity += item.quantidade || 0;
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

    const updateData = {
      ...dto,
      updatedAt: new Date(),
    };

    await docRef.set(updateData as UpdateData<DocumentData>, { merge: true });
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

  async findByBuyer(compradorId: string) {
    const snapshot = await this.db
      .collectionGroup('orders')
      .where('compradorId', '==', compradorId)
      .get();

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
}
