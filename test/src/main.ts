import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  
  app.getHttpAdapter().getInstance().register(fastifyCookie);

  await app.listen(3001);
}

bootstrap();
