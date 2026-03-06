import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não existem no DTO
      forbidNonWhitelisted: true, // Exibe erro se enviarem propriedades não mapeadas
      transform: true, // Transforma os payloads para instâncias das classes do DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
