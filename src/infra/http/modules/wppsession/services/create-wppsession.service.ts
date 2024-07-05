import { PrismaService } from '@/infra/prisma/prisma.service';
import { getIO } from '@/libs/socket';
import { initWASocket } from '@/libs/whatsappbot';
import { Injectable } from '@nestjs/common';

interface ExecuteProps {
  connectionId: number;
  organizationId: number;
}

@Injectable()
export class CreateWppSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ connectionId, organizationId }: ExecuteProps) {
    const io = getIO();

    const findConnection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    if (!findConnection) {
      throw new Error('Conexão não encontrada');
    }

    io.to(`organization-${organizationId}-mainchannel`).emit(
      'whatsappSession',
      {
        action: 'update',
        findConnection,
      },
    );

    try {
      // TODO: Inicia o WASocket do WhiskeyBaileys
      const whatsappbot = await initWASocket(findConnection, this.prisma);
      console.log(whatsappbot);
    } catch (error) {
      console.log(error);
    }
  }
}
