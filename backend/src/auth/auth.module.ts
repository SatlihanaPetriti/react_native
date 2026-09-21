import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

  @Module({
    imports: [
      UserModule,
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        }),
      }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [JwtModule]
  })
export class AuthModule {}
