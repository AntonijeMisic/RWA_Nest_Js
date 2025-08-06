import { Module } from '@nestjs/common';
import { lookupProviders } from './lookups.providers';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LookupsController],
  providers: [...lookupProviders, LookupsService],
  exports: [LookupsService],
})
export class LookupsModule {}
