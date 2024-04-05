import { NestFactory } from '@nestjs/core';
import { AppModule } from './main.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common/pipes';
import { HttpStatus } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({ errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED }),
  );
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();