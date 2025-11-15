import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from './dto/userFilter.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(filterDto: UserFilterDto): Promise<User[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRole', 'userRole')
      .leftJoinAndSelect('user.userPosition', 'userPosition');

    if (filterDto.firstName) {
      query.andWhere('user.firstName LIKE :firstName', {
        firstName: `%${filterDto.firstName}%`,
      });
    }
    if (filterDto.lastName) {
      query.andWhere('user.lastName LIKE :lastName', {
        lastName: `%${filterDto.lastName}%`,
      });
    }
    if (filterDto.email) {
      query.andWhere('user.email LIKE :email', {
        email: `%${filterDto.email}%`,
      });
    }
    if (filterDto.userRoleId) {
      query.andWhere('user.userRoleId = :userRoleId', {
        userRoleId: filterDto.userRoleId,
      });
    }
    if (filterDto.userPositionId) {
      query.andWhere('user.userPositionId = :userPositionId', {
        userPositionId: filterDto.userPositionId,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRole', 'userRole')
      .leftJoinAndSelect('user.userPosition', 'userPosition')
      .where('user.userId = :id', { id })
      .getOne();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async upsertUser(userDto: UserDto): Promise<User> {
    if (userDto.userId) {
      const existingUser = await this.userRepository.findOne({
        where: { userId: userDto.userId },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id ${userDto.userId} not found`);
      }

      for (const key of Object.keys(userDto)) {
        const value = userDto[key as keyof UserDto];
        if (value !== undefined) {
          if (key === 'password') {
            (existingUser as any)[key] = await bcrypt.hash(value as string, 10);
          } else {
            (existingUser as any)[key] = value;
          }
        }
      }

      return this.userRepository.save(existingUser);
    } else {
      if (!userDto.password) {
        throw new BadRequestException('Password is required');
      }
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const user = this.userRepository.create({
        ...userDto,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userRepository.remove(existingUser);
  }
}
