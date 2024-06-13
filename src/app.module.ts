import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './models/user.model';
import { Address } from './models/address.model';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';

type Dialect = 'postgres';

@Module({
  imports: [
    //Configure configuration module for .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DIALECT as Dialect,
      host: process.env.DBHOST,
      port: +process.env.DBPORT,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [User, Address],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
