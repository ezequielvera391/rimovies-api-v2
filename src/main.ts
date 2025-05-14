import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      bufferLogs: true,
    });
    // TODO: Add personalization of cors
    app.enableCors();

    await app.listen(3000);
    logger.log('🚀 Application is running on: http://localhost:3000');
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
