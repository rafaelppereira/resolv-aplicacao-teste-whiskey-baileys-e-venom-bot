import { Module } from '@nestjs/common';
import { WppSessionController } from './wppsession.controller';
import { CreateWppSessionService } from './services/create-wppsession.service';
import { UpdateWppSessionService } from './services/update-wppsession.service';
import { DeleteWppSessionService } from './services/delete-wppsession.service';

@Module({
  controllers: [WppSessionController],
  providers: [
    CreateWppSessionService,
    UpdateWppSessionService,
    DeleteWppSessionService,
  ],
})
export class WppSessionModule {}
