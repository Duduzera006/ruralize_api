import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import { FirebaseService } from '../../../src/firebase/firebase.service.js';
import type { Response } from 'supertest';
import type request from 'supertest';

export type App = Parameters<typeof request>[0];

interface IApp {
  getHttpServer: () => App;
  init: () => Promise<void>;
  close: () => Promise<void>;
  useGlobalPipes: (p: unknown) => void;
}

interface IMockDoc {
  id: string;
  set: (data: Record<string, unknown>) => Promise<void>;
  get: () => Promise<{ exists: boolean; data: () => Record<string, unknown> }>;
  delete: () => Promise<void>;
  update: (data: Record<string, unknown>) => Promise<void>;
  collection: () => IMockCollection;
}

interface IMockCollection {
  doc: (id?: string) => IMockDoc;
  get: () => Promise<{
    docs: { id: string; data: () => Record<string, unknown>; ref: { path: string } }[];
    empty: boolean;
    size: number;
    forEach: (cb: (doc: { data: () => Record<string, unknown> }) => void) => void;
  }>;
  where: () => IMockCollection;
  orderBy: () => IMockCollection;
  limit: () => IMockCollection;
  add: (data: Record<string, unknown>) => Promise<{
    id: string;
    get: () => Promise<{ id: string; data: () => Record<string, unknown> }>;
  }>;
}

interface ITransaction {
  get: (ref: unknown) => Promise<{ exists: boolean; data: () => Record<string, unknown> }>;
  update: (ref: unknown, data: Record<string, unknown>) => void;
  set: (ref: unknown, data: Record<string, unknown>) => void;
}

export class CustomWorld extends World {
  app!: IApp;
  server!: App;
  lastResponse!: Response;
  payload: Record<string, unknown> = {};
  empresaId?: string;
  productData: Record<string, unknown> = {};
  authToken?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initApp(): Promise<void> {
    process.env.FIREBASE_PROJECT_ID = 'mock-project';
    process.env.FIREBASE_CLIENT_EMAIL = 'mock@mock.com';
    process.env.FIREBASE_PRIVATE_KEY = 'mock-key';
    process.env.CLOUDINARY_CLOUD_NAME = 'mock-cloud';
    process.env.CLOUDINARY_API_KEY = 'mock-key';
    process.env.CLOUDINARY_API_SECRET = 'mock-secret';

    const mockAuth = {
      getUserByEmail: (email: string) =>
        Promise.resolve({ uid: 'mock-uid-' + email.split('@')[0] }),
      updateUser: (uid: string, data: Record<string, unknown>) => Promise.resolve({ uid, ...data }),
      deleteUser: () => Promise.resolve(),
    };

    const mockDoc = (id?: string, data: Record<string, unknown> = {}): IMockDoc => ({
      id: id || 'mock-id',
      set: () => Promise.resolve(),
      get: () =>
        Promise.resolve({
          exists: true,
          data: () => ({
            titulo: 'Mock Product',
            estoque: 100,
            preco: 10,
            clienteNome: 'Mock Cliente',
            buyerName: 'Mock Buyer',
            lida: false,
            status: 'PENDENTE',
            fotos: [],
            ...data,
            ...this.productData,
          }),
        }),
      delete: () => Promise.resolve(),
      update: () => Promise.resolve(),
      collection: () => mockCollection(),
    });

    const mockCollection = (docs: Record<string, unknown>[] = []): IMockCollection => ({
      doc: (id: string = 'new-id') => mockDoc(id),
      get: () =>
        Promise.resolve({
          docs: docs.map((d) => ({
            id: 'mock-id',
            data: () => d,
            ref: { path: 'users/mock-id/products/mock-id' },
          })),
          empty: docs.length === 0,
          size: docs.length,
          forEach: (cb: (doc: { data: () => Record<string, unknown> }) => void) =>
            docs.forEach((d) => cb({ data: () => d })),
        }),
      where: () => mockCollection(docs),
      orderBy: () => mockCollection(docs),
      limit: () => mockCollection(docs),
      add: (data: Record<string, unknown>) =>
        Promise.resolve({
          id: 'new-id',
          get: () => Promise.resolve({ id: 'new-id', data: () => data }),
        }),
    });

    const mockFirestore = {
      collection: () => mockCollection(),
      collectionGroup: () => mockCollection(),
      runTransaction: async (cb: (tx: ITransaction) => Promise<unknown>) => {
        return cb({
          get: () =>
            Promise.resolve({
              exists: true,
              data: () => ({
                titulo: 'Mock Product',
                estoque: 100,
                preco: 10,
                ...this.productData,
              }),
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

    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await nestApp.init();

    this.app = nestApp as unknown as IApp;
    this.server = this.app.getHttpServer();
  }
}

setWorldConstructor(CustomWorld);
