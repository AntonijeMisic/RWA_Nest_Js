import { Module } from '@nestjs/common';
import { userProviders } from './users.providers';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...userProviders, UsersService],
  exports: [...userProviders, UsersService],
})
export class UserModule {}