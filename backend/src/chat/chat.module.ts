import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Conversation } from './Entity/conversation.entity';
import { Message } from './Entity/message.entity';
import { UserModule } from '../user/user.module';
import { ConversationParticipant } from './Entity/conversation-participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, ConversationParticipant]),

    UserModule,
    AuthModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
  ],
  controllers: [
    ChatController,
  ],
})
export class ChatModule { }