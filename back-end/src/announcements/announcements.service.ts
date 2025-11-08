import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementDto } from './dto/announcements.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @Inject('ANNOUNCEMENTS_REPOSITORY')
    private readonly announcementsRepo: Repository<Announcement>,
  ) {}

  // CREATE
  async create(announcementDto: AnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementsRepo.create({
      ...announcementDto
    });
    return this.announcementsRepo.save(announcement);
  }

  // GET ALL
  async findAll(): Promise<Announcement[]> {
    return this.announcementsRepo.find({
      relations: ['createdBy'],
      order: { announcementId: 'DESC' },
    });
  }

  // GET ONE
  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementsRepo.findOne({
      where: { announcementId: id },
      relations: ['createdBy'],
    });
    if (!announcement) throw new NotFoundException(`Announcement ${id} not found`);
    return announcement;
  }

  // UPDATE
  async update(id: number, dto: AnnouncementDto): Promise<Announcement> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, dto);
    return this.announcementsRepo.save(announcement);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementsRepo.remove(announcement);
  }
}
