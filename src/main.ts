import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Konfiqurasiyası
  const config = new DocumentBuilder()
    .setTitle('Neysoft API')
    .setDescription('Neysoft Mağaza İdarəetmə Sistemi API Sənədləri')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('products')
    .addBearerAuth() // Token ilə qorunan API-lər üçün
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Sənədlər localhost:3000/api ünvanında olacaq

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();