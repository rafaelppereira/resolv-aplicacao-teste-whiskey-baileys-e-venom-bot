import { PrismaService } from '@/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateWppSessionService } from './create-wppsession.service';

interface ExecuteProps {
  connectionId: number;
  organizationId: number;
}

@Injectable()
export class UpdateWppSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createWppSessionService: CreateWppSessionService,
  ) {}

  async execute({ connectionId, organizationId }: ExecuteProps) {
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
        session: '',
      },
    });

    await this.createWppSessionService.execute({
      connectionId,
      organizationId,
    });
  }
}
