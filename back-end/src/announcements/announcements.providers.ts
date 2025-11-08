import { DataSource } from "typeorm";
import { Announcement } from "./announcement.entity";

export const announcementsProviders = [
  {
    provide: 'ANNOUNCEMENTS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Announcement),
    inject: ['DATA_SOURCE'],
  },
];