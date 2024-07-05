import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [HttpModule, SharedModule],
})
export class AppModule {}
