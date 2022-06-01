/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationMiddleware } from 'src/config/middleware/authentication.middleware';
import { JwtTokenService } from 'src/config/providers/jwtService.service';
import { User } from 'src/entitty/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
  TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [UserService, JwtTokenService],
      controllers: [UserController],
      exports:[UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes('*');
  }
}