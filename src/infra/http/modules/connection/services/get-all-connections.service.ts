import { PrismaService } from "@/infra/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetAllConnectionsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async execute() {
    const connections = await this.prisma.connection.findMany()

    return connections
  }
}