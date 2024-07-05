import { Module } from '@nestjs/common';
import { WhatsAppModule } from './modules/connection/connection.module';
import { WppSessionModule } from './modules/wppsession/wppsession.module';

@Module({
  imports: [WhatsAppModule, WppSessionModule],
})
export class HttpModule {}
