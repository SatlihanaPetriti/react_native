import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.register({
      secret: 'secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
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