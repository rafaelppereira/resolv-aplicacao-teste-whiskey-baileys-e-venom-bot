import { PrismaService } from '@/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

interface ExecuteProps {
  connectionId: number;
}

@Injectable()
export class GetConnectionByIdService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ connectionId }: ExecuteProps) {
    const findConnection = await this.prisma.connection.findUnique({
      where: {
        id: connectionId,
      },
    });

    if (!findConnection) {
      throw new Error('Conexão não encontrada');
    }

    return findConnection;
  }
}
