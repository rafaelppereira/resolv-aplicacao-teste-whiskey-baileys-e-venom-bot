import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$connect;
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      app.close;
    });
  }
}
