import { Module } from '@nestjs/common';
import { WhatsAppController } from './connection.controller';
import { CreateConnectionService } from './services/create-connection.service';
import { GetAllConnectionsService } from './services/get-all-connections.service';
import { GetConnectionByIdService } from './services/get-connection-by-id.service';
import { CreateWppSessionService } from '../wppsession/services/create-wppsession.service';
import { RemoveConnectionService } from './services/remove-connection.service';

@Module({
  controllers: [WhatsAppController],
  providers: [
    CreateConnectionService,
    GetAllConnectionsService,
    GetConnectionByIdService,
    CreateWppSessionService,
    RemoveConnectionService,
  ],
})
export class WhatsAppModule {}
