import { PrismaService } from '@/infra/prisma/prisma.service';
import { getIO } from '@/libs/socket';
import { Injectable } from '@nestjs/common';

interface ExecuteProps {
  connectionId: number;
  organizationId: number;
}

@Injectable()
export class RemoveConnectionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ connectionId, organizationId }: ExecuteProps) {
    const findConnection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    if (!findConnection) {
      throw new Error('Conexão não encontrada');
    }

    await this.prisma.connection.delete({
      where: {
        id: connectionId,
      },
    });

    const io = getIO();
    io.to(`organization-${organizationId}-mainchannel`).emit(
      `organization-${organizationId}-whatsapp`,
      {
        action: 'delete',
        whatsappId: +connectionId,
      },
    );
  }
}
