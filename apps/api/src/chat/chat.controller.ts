import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async chat(
    @Body('message') message: string,
    @Headers('authorization') auth: string,
  ) {
    const response = await this.chatService.getResponse(message, auth);
    return { response };
  }
}
