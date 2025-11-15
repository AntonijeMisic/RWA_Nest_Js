import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LookupsModule } from './lookups/lookups.module';
import { UserModule } from './users/users.module';
import Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { AnnouncementModule } from './announcements/announcements.module';
import { WorkLogModule } from './worklogs/worklog.module';
import { LeaveRequestModule } from './leave-requests/leave-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    LookupsModule,
    UserModule,
    AnnouncementModule,
    AuthModule,
    WorkLogModule,
    LeaveRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
