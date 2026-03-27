import { Injectable, Logger } from '@nestjs/common';
import { Channel } from 'prisma/generated/browser';
import { ChannelCreateManyInput } from 'prisma/generated/models';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);
  constructor(private readonly prismaService: PrismaService) {}

  public async create(data: ChannelCreateManyInput): Promise<Channel | null> {
    try {
      return await this.prismaService.channel.create({ data });
    } catch (error) {
      this.logger.error('CREATE ', error);
      return null;
    }
  }

  public async update(id: string, data: string): Promise<Channel | null> {
    try {
      return await this.prismaService.channel.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error('UPDATE ', error);
      return null;
    }
  }

  public async delete(id: string): Promise<boolean | null> {
    try {
      const message = await this.prismaService.channel.delete({
        where: { id },
      });
      if (!message) return null;
      return true;
    } catch (error) {
      this.logger.error('DELETE ', error);
      return null;
    }
  }
}
