import { IsNotEmpty, IsString } from 'class-validator';
import { ChatType } from 'prisma/generated/enums';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: ChatType;

  @IsNotEmpty()
  @IsString()
  channelId: string;
}

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  chatId: string;
}
