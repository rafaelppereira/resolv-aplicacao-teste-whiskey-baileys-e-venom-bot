import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { initIO } from './libs/socket';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  const server = await app.listen(3000, async () => {
    Logger.verbose('🚀 Server is running');
  });

  initIO(server);
}

bootstrap();
