import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'prisma/generated/browser';
import { MessageCreateManyInput } from 'prisma/generated/models';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class MessageService {
  private logger = new Logger(MessageService.name);
  constructor(private readonly prismaService: PrismaService) {}

  public async create(data: MessageCreateManyInput): Promise<Message | null> {
    try {
      return await this.prismaService.message.create({ data });
    } catch (error) {
      this.logger.error('CREATE ', error);
      return null;
    }
  }

  public async update(id: string, content: string): Promise<Message | null> {
    try {
      return await this.prismaService.message.update({
        where: { id },
        data: { content, isEdited: true },
      });
    } catch (error) {
      this.logger.error('UPDATE ', error);
      return null;
    }
  }

  public async delete(id: string): Promise<boolean | null> {
    try {
      const message = await this.prismaService.message.update({
        where: { id },
        data: { isDeleted: true },
      });
      if (!message) return null;
      return true;
    } catch (error) {
      this.logger.error('DELETE ', error);
      return null;
    }
  }
}
