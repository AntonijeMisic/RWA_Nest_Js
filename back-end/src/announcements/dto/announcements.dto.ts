import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { User } from 'src/users/user.entity';

export class AnnouncementDto {
    @IsOptional()
    announcementId?: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    visible_until?: Date | null;

    @IsOptional()
    createdBy?: User;
}