// src/auth/auth.service.ts
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { RefreshToken } from './refreshToken/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private refreshTokenRepository: Repository<RefreshToken>
  ) { }

  private getJwtToken(userId: number, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }

  async register(dto: UserDto) {
    const user = await this.usersService.upsertUser(dto);
    const token = this.getJwtToken(user.userId, user.email);
    return { user, access_token: token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.getJwtToken(user.userId, user.email);

    const refreshTokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token: refreshTokenValue,
      user,
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshToken);

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshTokenValue,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }


  async refreshToken(token: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = tokenRecord.user;
    await this.refreshTokenRepository.remove(tokenRecord);

    const newRefreshTokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newRefreshToken = this.refreshTokenRepository.create({
      token: newRefreshTokenValue,
      user,
      expiresAt,
    });
    await this.refreshTokenRepository.save(newRefreshToken);

    const payload = { sub: user.userId, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    return {
      access_token: accessToken,
      refresh_token: newRefreshTokenValue,
    };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    const tokenRecord = await this.refreshTokenRepository.findOneBy({ token: refreshToken });
    if (tokenRecord) {
      await this.refreshTokenRepository.remove(tokenRecord);
    }
    return { message: 'Logged out successfully' };
  }
}
