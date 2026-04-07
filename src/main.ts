import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no permitidos
      forbidNonWhitelisted: true, // error si mandan campos extra
      transform: true, // transforma tipos automáticamente
    }),
  );

  // 🚫 NO poner guards globales aquí (rompe register/login)

  await app.listen(3000);
}
bootstrap();