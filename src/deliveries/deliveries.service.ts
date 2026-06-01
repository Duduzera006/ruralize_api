import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateDeliveryDto, DeliveryStatus } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { CollectionReference, Firestore, UpdateData, DocumentData } from 'firebase-admin/firestore';

@Injectable()
export class DeliveriesService implements OnModuleInit {
  private db: Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  private getDeliveriesCollection(empresaId: string): CollectionReference {
    return this.db.collection('users').doc(empresaId).collection('deliveries');
  }

  async create(dto: CreateDeliveryDto) {
    const { empresaId, ...data } = dto;
    const deliveriesColl = this.getDeliveriesCollection(empresaId);

    const deliveryData = {
      ...data,
      status: data.status || DeliveryStatus.PENDENTE,
      createdAt: new Date(),
    };

    const docRef = await deliveriesColl.add(deliveryData);
    const snapshot = await docRef.get();

    return { id: snapshot.id, empresaId, ...snapshot.data() };
  }

  async findAll(empresaId: string) {
    const snapshot = await this.getDeliveriesCollection(empresaId).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async findOne(empresaId: string, deliveryId: string) {
    const doc = await this.getDeliveriesCollection(empresaId).doc(deliveryId).get();
    if (!doc.exists) {
      throw new NotFoundException('Entrega não encontrada');
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(empresaId: string, deliveryId: string, dto: UpdateDeliveryDto) {
    const docRef = this.getDeliveriesCollection(empresaId).doc(deliveryId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Entrega não encontrada');
    }

    // Filtrar campos para evitar sobrescrever a empresaId e remover undefined
    const { empresaId: _empresaId, ...cleanDto } = dto;
    const updateData = Object.fromEntries(
      Object.entries(cleanDto).filter(([, val]) => val !== undefined),
    );

    await docRef.update(updateData as UpdateData<DocumentData>);
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  }

  async remove(empresaId: string, deliveryId: string) {
    const docRef = this.getDeliveriesCollection(empresaId).doc(deliveryId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Entrega não encontrada');
    }

    await docRef.delete();
    return { message: 'Entrega removida com sucesso' };
  }
}
