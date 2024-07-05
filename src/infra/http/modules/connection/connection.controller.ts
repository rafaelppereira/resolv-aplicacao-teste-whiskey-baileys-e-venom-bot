import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateConnectionService } from './services/create-connection.service';
import { GetAllConnectionsService } from './services/get-all-connections.service';
import { GetConnectionByIdService } from './services/get-connection-by-id.service';
import { RemoveConnectionService } from './services/remove-connection.service';

@Controller({ version: '1', path: 'connections' })
export class WhatsAppController {
  constructor(
    private readonly createConnectionService: CreateConnectionService,
    private readonly getAllConnectionsService: GetAllConnectionsService,
    private readonly getConnectionByIdService: GetConnectionByIdService,
    private readonly removeConnectionService: RemoveConnectionService,
  ) {}

  @Get()
  getAllConnections() {
    return this.getAllConnectionsService.execute();
  }

  @Get(':connectionId')
  getConnectionById(@Param('connectionId') connectionId: string) {
    return this.getConnectionByIdService.execute({
      connectionId: Number(connectionId),
    });
  }

  @Post()
  createConnection() {
    return this.createConnectionService.execute();
  }

  @Delete(':connectionId')
  remoceConnection(
    @Param('connectionId') connectionId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.removeConnectionService.execute({
      connectionId: Number(connectionId),
      organizationId: Number(organizationId),
    });
  }
}
