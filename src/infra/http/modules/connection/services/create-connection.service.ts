import { PrismaService } from '@/infra/prisma/prisma.service';
import { getIO } from '@/libs/socket';
import { Injectable } from '@nestjs/common';
import { CreateWppSessionService } from '../../wppsession/services/create-wppsession.service';

import { faker } from '@faker-js/faker';

@Injectable()
export class CreateConnectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createWppSessionService: CreateWppSessionService,
  ) {}

  async execute() {
    const organizationId = 1;
    const connection = await this.prisma.connection.create({
      data: {
        name: faker.person.fullName(),
        status: 'OPENING',
        provider: 'beta',
        isDefault: true,

        greetingMessage: '',
        farewellMessage: '',
        complationMessage: '',
        maxUseBotQueues: 3,
        timeUseBotQueues: 0,
        outOfHoursMessage: '',
        plugged: '',
        qrcode: '',
        ratingMessage: '',
        retries: 0,
        session: '',
        token: '',

        organizationId,
      },
    });

    this.createWppSessionService.execute({
      connectionId: connection.id,
      organizationId,
    });

    const io = getIO();

    io.to(`organization-${organizationId}-mainchannel`).emit(
      `organization-${organizationId}-whatsapp`,
      {
        action: 'update',
        connection,
      },
    );
  }
}
