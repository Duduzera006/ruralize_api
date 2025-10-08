import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import credentialsModule from './serviceAccountKey.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: FirebaseFirestore.Firestore;
  private auth: admin.auth.Auth;

  onModuleInit() {
    if (admin.apps.length === 0) {
      const serviceAccount = credentialsModule as admin.ServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.db = admin.firestore();
    this.auth = admin.auth();
  }

  getFirestore() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }
}
