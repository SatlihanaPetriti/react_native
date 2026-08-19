import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/Entity/user.entity';
import { Conversation } from './chat/Entity/conversation.entity';
import { Message } from './chat/Entity/message.entity';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Inna1998',
      database: 'whatsapp',
      entities: [UserEntity, Conversation, Message],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
    AuthModule,
    UserModule,
    ChatModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('chat');
  }
}