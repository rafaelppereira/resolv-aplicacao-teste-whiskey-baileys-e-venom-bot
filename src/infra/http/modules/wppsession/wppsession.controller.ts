import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreateWppSessionService } from './services/create-wppsession.service';
import { UpdateWppSessionService } from './services/update-wppsession.service';
import { DeleteWppSessionService } from './services/delete-wppsession.service';

@Controller({ version: '1', path: 'wppsessions' })
export class WppSessionController {
  constructor(
    private readonly createWppSessionService: CreateWppSessionService,
    private readonly updateWppSessionService: UpdateWppSessionService,
    private readonly deleteWppSessionService: DeleteWppSessionService,
  ) {}

  @Post()
  createWppSession(
    @Body('connectionId') connectionId: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.createWppSessionService.execute({
      connectionId: Number(connectionId),
      organizationId: Number(organizationId),
    });
  }

  @Put(':connectionId')
  updateWppSession(
    @Param('connectionId') connectionId: string,
    @Body('organizationId') organizationId: string,
  ) {
    return this.updateWppSessionService.execute({
      connectionId: Number(connectionId),
      organizationId: Number(organizationId),
    });
  }

  @Delete(':connectionId')
  deleteWppSession(@Param('connectionId') connectionId: string) {
    return this.deleteWppSessionService.execute({
      connectionId: Number(connectionId),
    });
  }
}
