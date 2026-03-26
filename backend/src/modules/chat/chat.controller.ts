import { Body, Controller, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateMessageDto } from './dto/chat.dto';
import { Protected } from 'src/shared/decorators/protected.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import {
  ChatCreateManyInput,
  MessageCreateManyInput,
} from 'prisma/generated/models';
import { MessageType } from 'prisma/generated/enums';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Protected()
  @Post('get')
  public async getChats(
    @Authorized('id') userId: string,
    @Query('channelId') channelId: string,
  ) {
    return await this.chatService.get(channelId, userId);
  }

  @Protected()
  @Post('create')
  public async createChat(
    @Authorized('id') createdBy: string,
    @Body() dto: CreateChatDto,
  ) {
    const data: ChatCreateManyInput = { isActive: true, createdBy, ...dto };
    return await this.chatService.create(data);
  }

  @Protected()
  @Post('create-message')
  public async createMessage(
    @Authorized('id') senderId: string,
    @Body() dto: CreateMessageDto,
  ) {
    const data: MessageCreateManyInput = {
      senderId,
      type: MessageType.CHAT,
      ...dto,
    };
    return await this.chatService.sendMessage(data);
  }
}
