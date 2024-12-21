import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import * as bodyParser from 'body-parser';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Increase payload size limit
  app.use(bodyParser.json({ limit: '10mb' })); // Adjust the size as needed
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Enable CORS with specific configuration
  app.enableCors({
    origin: 'http://localhost:3001', // URL of your Next.js frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // specify the headers you expect from the frontend
    credentials: true, // Allow sending cookies or authorization headers
  });

  await app.listen(process.env.PORT ?? 3000);

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
}

bootstrap();
