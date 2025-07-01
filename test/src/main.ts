import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as fastifyCookie from 'fastify-cookie';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: 'http://localhost:3000',  // Allow requests only from this origin
    methods: 'GET,POST,PUT,PATCH',    // Allow specific HTTP methods
               
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  
  app.getHttpAdapter().getInstance().register(fastifyCookie);

  await app.listen(3002); 
}

bootstrap();
