import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { MessageService } from './messages/message.service';
import {
  ChatCreateManyInput,
  MessageCreateManyInput,
} from 'prisma/generated/models';

@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  public async get(channelId: string, userId: string) {
    try {
      return this.prismaService.chat.findMany({
        where: { channelId, participants: { some: { userId } } },
      });
    } catch (error) {
      this.logger.error('GET ', error);
    }
  }

  public async create(data: ChatCreateManyInput) {
    try {
      return this.prismaService.chat.create({ data });
    } catch (error) {
      this.logger.error('CREATE ', error);
    }
  }

  public async sendMessage(data: MessageCreateManyInput) {
    try {
      this.messageService.create(data);
    } catch (error) {
      this.logger.error('SEND MESSAGE ', error);
    }
  }
}
