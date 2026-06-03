import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import { FirebaseService } from '../../../src/firebase/firebase.service.js';
import request from 'supertest';

export class CustomWorld extends World {
  app: INestApplication;
  lastResponse: request.Response;
  authToken: string;
  payload: any;
  empresaId: string;
  productData: any;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initApp() {
    const mockAuth = {
      getUserByEmail: (email: string) =>
        Promise.resolve({ uid: 'mock-uid-' + email.split('@')[0] }),
      updateUser: (uid: string, data: any) => Promise.resolve({ uid, ...data }),
    };

    const mockDoc = (id: string = 'mock-id', data: any = {}) => ({
      id,
      set: () => Promise.resolve(),
      get: () => Promise.resolve({ exists: true, data: () => ({ ...data, ...this.productData }) }),
      delete: () => Promise.resolve(),
      update: () => Promise.resolve(),
      collection: () => mockCollection(),
    });

    const mockCollection = (docs: any[] = []) => ({
      doc: (id: string = 'new-id') => mockDoc(id),
      get: () => Promise.resolve({ 
        docs: docs.map(d => ({ id: 'mock-id', data: () => d, ref: { path: 'users/mock-id/products/mock-id' } })), 
        empty: docs.length === 0,
        size: docs.length,
        forEach: (cb: any) => docs.forEach(d => cb({ data: () => d }))
      }),
      where: () => mockCollection(docs),
      orderBy: () => mockCollection(docs),
      limit: () => mockCollection(docs),
      add: (data: any) => Promise.resolve({ 
        id: 'new-id', 
        get: () => Promise.resolve({ id: 'new-id', data: () => data }) 
      }),
    });

    const mockFirestore = {
      collection: () => mockCollection(),
      collectionGroup: () => mockCollection(),
      runTransaction: async (cb: any) => {
        return cb({
          get: () => Promise.resolve({ 
            exists: true, 
            data: () => this.productData || { estoque: 100, titulo: 'Mock Product' } 
          }),
          update: () => {},
          set: () => {},
        });
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue({
        getAuth: () => mockAuth,
        getFirestore: () => mockFirestore,
        getMessaging: () => ({ send: () => Promise.resolve() }),
        getStorage: () => ({}),
      })
      .compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await this.app.init();
  }
}

setWorldConstructor(CustomWorld);
