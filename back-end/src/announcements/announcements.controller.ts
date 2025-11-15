import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AnnouncementDto } from './dto/announcements.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Post()
  async create(@Body() dto: AnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.announcementsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: AnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.announcementsService.remove(id);
  }
}
