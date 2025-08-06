import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/User.dto';

@Injectable()
export class UsersService {
    constructor(@Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ userId: id });
    }

    async upsertUser(userDto: UserDto): Promise<User> {
        if (userDto.userId) {
            const existingUser = await this.userRepository.findOne({
                where: { userId: userDto.userId },
            });

            if (!existingUser) {
                throw new NotFoundException(`User with id ${userDto.userId} not found`);
            }

            Object.keys(userDto).forEach((key) => {
                const value = userDto[key as keyof UserDto];
                if (value !== undefined) {
                    (existingUser as any)[key] = value;
                }
            });

            return this.userRepository.save(existingUser);
        } else {
            const newUser = this.userRepository.create(userDto);
            return this.userRepository.save(newUser);
        }
    }

    async deleteUser(userId: number): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { userId } });

        if (!existingUser) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        await this.userRepository.remove(existingUser);
    }
}
