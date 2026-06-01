import { Injectable, OnModuleInit } from '@nestjs/common';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: Firestore;
  private authInstance: Auth;
  private storageInstance: Storage;
  private messagingInstance: Messaging;
  private firebaseApp: App;

  onModuleInit() {
    console.log('Iniciando FirebaseService (Versão Modular)...');
    try {
      const currentApps = getApps();

      if (currentApps.length === 0) {
        console.log('Nenhum app Firebase detectado. Inicializando...');

        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
          throw new Error(
            'ERRO: Variáveis FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY não encontradas no ambiente.',
          );
        }

        this.firebaseApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
        console.log('Firebase inicializado com sucesso.');
      } else {
        this.firebaseApp = currentApps[0];
        console.log('Reutilizando instância existente do Firebase.');
      }

      // Inicialização das instâncias de serviço com tipagem correta
      this.db = getFirestore(this.firebaseApp);
      this.authInstance = getAuth(this.firebaseApp);
      this.storageInstance = getStorage(this.firebaseApp);
      this.messagingInstance = getMessaging(this.firebaseApp);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('FATAL: Falha ao conectar com o Firebase:', err.message);
      throw error;
    }
  }

  getFirestore(): Firestore {
    return this.db;
  }

  getAuth(): Auth {
    return this.authInstance;
  }

  getStorage(): Storage {
    return this.storageInstance;
  }

  getMessaging(): Messaging {
    return this.messagingInstance;
  }
}
