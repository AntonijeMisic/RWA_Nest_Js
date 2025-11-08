import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AnnouncementsController } from './announcements.controller';
import { announcementsProviders } from './announcements.providers';
import { AnnouncementsService } from './announcements.service';

@Module({
    imports: [DatabaseModule],
    controllers: [AnnouncementsController],
    providers: [...announcementsProviders, AnnouncementsService],
    exports: [...announcementsProviders, AnnouncementsService],
})
export class AnnouncementModule { }