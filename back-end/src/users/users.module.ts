import { Module } from '@nestjs/common';
import { userProviders } from './users.providers';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { LookupsModule } from 'src/lookups/lookups.module';

@Module({
  imports: [DatabaseModule, LookupsModule],
  controllers: [UsersController],
  providers: [...userProviders, UsersService],
  exports: [...userProviders, UsersService],
})
export class UserModule {}