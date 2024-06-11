import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // Here, Make configuration of JWT module for authentication.
    JwtModule.register({
      secret: 'JWTPrivateKey', // secret key for authnentication and use this secret key for authorization.
      signOptions: { expiresIn: '5h' }, // Here, Given expires time for token.
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
