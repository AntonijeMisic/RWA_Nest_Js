import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { Request } from 'express';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AnnouncementDto } from './dto/announcements.dto';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // CREATE
  @Post()
  async create(@Body() dto: AnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  // GET ALL
  @Get()
  async findAll() {
    return this.announcementsService.findAll();
  }

  // GET ONE
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.announcementsService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: AnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.announcementsService.remove(id);
  }
}