import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { Request, Response } from 'express';

dotenv.config();

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Ruralize API')
      .setDescription('Núcleo de inteligência do ecossistema Ruralize')
      .setVersion('1.0')
      .addTag('auth')
      .addTag('products')
      .addTag('orders')
      .addTag('deliveries')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
    });

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance() as unknown;
  }
  return cachedServer as (req: Request, res: Response) => void;
}

// Exportar para a Vercel
export default async (req: Request, res: Response) => {
  const server = await bootstrap();
  return server(req, res);
};

// Inicialização local (se não estiver na Vercel)
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('Ruralize API')
      .setDescription('Local Development')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3001);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
  };
  void start();
}
