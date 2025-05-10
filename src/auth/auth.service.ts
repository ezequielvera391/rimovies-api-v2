import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePassword } from '../user/utils/password.utils';
import { UserResponseDto } from '../common/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserByEmail(email);
    const isPasswordValid = await comparePassword(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  async login(user: UserResponseDto): Promise<AuthResponseDto> {
    const access_token = await this.generateAccessToken(user);
    return {
      access_token,
      user,
    };
  }

  async logout(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.decode(token);
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);

      if (ttl > 0) {
        await this.cacheService.set(`invalid_token:${token}`, true, ttl);
      }
    } catch (error) {
      // Si el token no es válido, no necesitamos hacer nada
      console.error(error);
    }
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    return !!(await this.cacheService.get(`invalid_token:${token}`));
  }

  private async generateAccessToken(user: UserResponseDto): Promise<string> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1d', // Access token expira en 1 día
    });
  }
}
