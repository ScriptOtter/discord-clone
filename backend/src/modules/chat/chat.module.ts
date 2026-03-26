import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageService } from './messages/message.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService, MessageService, PrismaService],
})
export class ChatModule {}
