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
import { UserRole } from 'src/lookups/entities/userRole.entity';
import { UserPosition } from 'src/lookups/entities/userPosition.entity';
import { LookupsService } from 'src/lookups/lookups.service';

@Injectable()
export class UsersService {
  private rolesCache: UserRole[] | null = null;
  private positionsCache: UserPosition[] | null = null;

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private lookupService: LookupsService,
  ) {}

  private async getRoles(): Promise<UserRole[]> {
    if (!this.rolesCache) {
      this.rolesCache = await this.lookupService.getUserRoles();
    }
    return this.rolesCache;
  }

  private async getPositions(): Promise<UserPosition[]> {
    if (!this.positionsCache) {
      this.positionsCache = await this.lookupService.getUserPositions();
    }
    return this.positionsCache;
  }

  async getRoleById(userRoleId: number): Promise<UserRole> {
    const roles = await this.getRoles();
    const role = roles.find((r) => r.userRoleId === userRoleId);

    if (!role) {
      throw new BadRequestException(`Role with id ${userRoleId} not found`);
    }

    return role;
  }

  async getPositionById(userpositionId: number): Promise<UserPosition> {
    const positions = await this.getPositions();
    const position = positions.find((r) => r.userPositionId === userpositionId);

    if (!position) {
      throw new BadRequestException(
        `Position with id ${userpositionId} not found`,
      );
    }

    return position;
  }

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

      if (userDto.firstName !== undefined)
        existingUser.firstName = userDto.firstName;
      if (userDto.lastName !== undefined)
        existingUser.lastName = userDto.lastName;
      if (userDto.email !== undefined) existingUser.email = userDto.email;
      if (userDto.startDate !== undefined)
        existingUser.startDate = new Date(userDto.startDate);
      if (userDto.endDate !== undefined)
        existingUser.endDate = userDto.endDate
          ? new Date(userDto.endDate)
          : null;

      if (userDto.password) {
        existingUser.password = await bcrypt.hash(userDto.password, 10);
      }

      if (userDto.userRoleId !== undefined) {
        const role = await this.getRoleById(userDto.userRoleId);
        existingUser.userRole = role;
        existingUser.userRoleId = userDto.userRoleId;
      }

      if (userDto.userPositionId !== undefined) {
        const position = await this.getPositionById(userDto.userPositionId);
        existingUser.userPosition = position;
        existingUser.userPositionId = userDto.userPositionId;
      }

      return this.userRepository.save(existingUser);
    } else {
      if (!userDto.password) {
        throw new BadRequestException('Password is required');
      }

      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      const user = new User();

      if (userDto.firstName) user.firstName = userDto.firstName;
      if (userDto.lastName) user.lastName = userDto.lastName;
      if (userDto.email) user.email = userDto.email;
      user.password = hashedPassword;
      if (userDto.startDate) user.startDate = new Date(userDto.startDate);
      user.endDate = userDto.endDate ? new Date(userDto.endDate) : null;

      if (userDto.userRoleId !== undefined) {
        const role = await this.getRoleById(userDto.userRoleId);
        user.userRole = role;
        user.userRoleId = userDto.userRoleId;
      }

      if (userDto.userPositionId !== undefined) {
        const position = await this.getPositionById(userDto.userPositionId);
        user.userPosition = position;
        user.userPositionId = userDto.userPositionId;
      }

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
