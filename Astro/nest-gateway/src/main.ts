import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitamos CORS para que las páginas estáticas que sirvamos (localhost:4321) puedan llamar a los microservicios
  app.enableCors({ origin: ['http://localhost:4321'] });
  await app.listen(4321);
  console.log('Nest Gateway corriendo en http://localhost:4321');
}
bootstrap();