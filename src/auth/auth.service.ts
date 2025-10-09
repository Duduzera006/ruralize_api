import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service.js';
import { SignUpDto } from './dto/signup.dto.js';
import * as admin from 'firebase-admin';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CollectionReference, Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';

@Injectable()
export class AuthService implements OnModuleInit {
  private usersCollection: CollectionReference;
  private db: Firestore;
  private auth: Auth;
  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.auth = this.firebaseService.getAuth();
    this.db = this.firebaseService.getFirestore();
    this.usersCollection = this.db.collection('users');
  }

  async getUserById(uid: string) {
    const userDoc = await this.usersCollection.doc(uid).get();

    if (!userDoc.exists) {
      throw new NotFoundException(`Usuário com ID ${uid} não encontrado`);
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  }

  async signUp(dto: SignUpDto) {
    const userRecord = await this.auth.getUserByEmail(dto.email);

    await this.usersCollection.doc(userRecord.uid).set({
      email: dto.email,
      displayName: dto.displayName,
      cnpj: dto.cnpj,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid, email: dto.email, displayName: dto.displayName };
  }

  async updateUser(dto: UpdateUserDto) {
    try {
      const updatedUser = await this.auth.updateUser(dto.uid, {
        displayName: dto.displayName,
        email: dto.email,
        password: dto.password,
      });

      await this.usersCollection.doc(dto.uid).set(
        {
          email: dto.email,
          displayName: dto.displayName,
          cnpj: dto.cnpj,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return {
        message: 'Usuário atualizado com sucesso',
        user: updatedUser,
      };
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado ou erro na atualização' + error);
    }
  }

  async deleteUser(uid: string) {
    await this.auth.deleteUser(uid);
    await this.usersCollection.doc(uid).delete();

    return { deleted: true };
  }
}
