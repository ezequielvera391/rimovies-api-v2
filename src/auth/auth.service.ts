import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePassword } from '../user/utils/password.utils';
import { UserResponseDto } from '../common/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { IAuthService } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    @Inject('JWT_REFRESH_SECRET') private readonly jwtRefreshSecret: string,
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

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser(registerDto);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  async login(user: UserResponseDto): Promise<AuthResponseDto> {
    const access_token = await this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(user);

    await this.storeRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<AuthResponseDto> {
    const isValid = await this.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getUserById(userId);
    const userDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const newAccessToken = await this.generateAccessToken(userDto);
    const newRefreshToken = await this.generateRefreshToken(userDto);

    await this.invalidateRefreshToken(userId, refreshToken);
    await this.storeRefreshToken(userId, newRefreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: userDto,
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

  async logoutAll(userId: number): Promise<void> {
    await this.cacheService.del(`refresh_tokens:${userId}`);
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    return !!(await this.cacheService.get(`invalid_token:${token}`));
  }

  private async generateAccessToken(user: UserResponseDto): Promise<string> {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });
  }

  private async generateRefreshToken(user: UserResponseDto): Promise<string> {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: '7d',
    });
  }

  private async storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const key = `refresh_tokens:${userId}`;
    const tokens = (await this.cacheService.get<string[]>(key)) || [];
    tokens.push(refreshToken);
    // Mantengo solo los últimos 5 tokens para seguridad
    if (tokens.length > 5) {
      tokens.splice(0, tokens.length - 5);
    }

    await this.cacheService.set(key, tokens, 7 * 24 * 60 * 60);
  }

  private async validateRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
    try {
      const key = `refresh_tokens:${userId}`;
      const tokens = (await this.cacheService.get<string[]>(key)) || [];

      return tokens.includes(refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  private async invalidateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const key = `refresh_tokens:${userId}`;
    const tokens = (await this.cacheService.get<string[]>(key)) || [];
    const filteredTokens = tokens.filter((token) => token !== refreshToken);

    await this.cacheService.set(key, filteredTokens, 7 * 24 * 60 * 60);
  }
}
