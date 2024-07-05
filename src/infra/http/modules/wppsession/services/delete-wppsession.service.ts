import { PrismaService } from '@/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteWppSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ connectionId }) {
    const findConnection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    if (!findConnection) {
      throw new Error('Conexão não encontrada');
    }

    await this.prisma.connection.update({
      where: {
        id: connectionId,
      },
      data: {
        status: 'DISCONNECTED',
        session: '',
      },
    });

    // TODO: const wbot = getWbot(whatsapp.id); await wbot.logout();
  }
}
