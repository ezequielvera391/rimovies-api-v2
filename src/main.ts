import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      bufferLogs: true,
    });
    
    // TODO: Add personalization of cors
    app.enableCors();

    // Configurar cookie parser
    app.use(cookieParser());

    // Configurar validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('RiMovies API')
      .setDescription('API for RiMovies application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    logger.log('🚀 Application is running on: http://localhost:3000');
    logger.log('📚 Swagger documentation available at: http://localhost:3000/api');
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      logger.error(
        '❌ Port 3000 is already in use. Please try a different port or kill the process using this port.',
      );
    } else {
      logger.error('❌ Error starting the application:', error.message);
    }
    process.exit(1);
  }
}

void bootstrap();
