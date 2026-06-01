import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';
import { Storage } from 'firebase-admin/storage';

import { Messaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: FirebaseFirestore.Firestore;
  private auth: admin.auth.Auth;
  private storage: admin.storage.Storage;
  private messaging: admin.messaging.Messaging;

  onModuleInit() {
    console.log('Iniciando FirebaseService...');
    try {
      if (admin.apps.length === 0) {
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
          throw new Error('Variáveis de ambiente do Firebase ausentes!');
        }

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
        console.log('Firebase Admin inicializado com sucesso.');
      }

      this.db = admin.firestore();
      this.auth = admin.auth();
      this.storage = admin.storage();
      this.messaging = admin.messaging();
    } catch (error) {
      console.error('ERRO FATAL NA INICIALIZAÇÃO DO FIREBASE:', error);
      throw error;
    }
  }

  getFirestore(): Firestore {
    return this.db;
  }

  getAuth(): Auth {
    return this.auth;
  }

  getStorage(): Storage {
    return this.storage;
  }

  getMessaging(): Messaging {
    return this.messaging;
  }
}
