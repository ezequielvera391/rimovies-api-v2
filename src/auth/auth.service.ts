import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { comparePassword } from '../user/utils/password.utils';
import { UserResponseDto } from '../common/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt.interface';
import { IAuthService } from './interfaces/auth-service.interface';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser(registerDto);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(user: UserResponseDto): Promise<AuthResponseDto & { refresh_token: string }> {
    const jti = this.tokenService.generateJti();
    const accessToken = await this.generateAccessToken(user, jti);
    const refreshToken = await this.generateRefreshToken(user);

    // Calcular fechas de expiración
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15);

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    // Guardar tokens en la base de datos
    await this.tokenService.createAccessToken(user.id, accessToken, jti, accessTokenExpiresAt);
    await this.tokenService.createRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto & { refresh_token: string }> {
    // Verificar que el refresh token existe y no está revocado
    const tokenRecord = await this.tokenService.findRefreshToken(refreshToken);
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getUserById(tokenRecord.userId);
    const userDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generar nuevos tokens
    const newJti = this.tokenService.generateJti();
    const newAccessToken = await this.generateAccessToken(userDto, newJti);
    const newRefreshToken = await this.generateRefreshToken(userDto);

    // Calcular fechas de expiración
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15);

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    // Revocar el refresh token anterior
    await this.tokenService.revokeRefreshToken(refreshToken);

    // Guardar los nuevos tokens
    await this.tokenService.createAccessToken(
      userDto.id,
      newAccessToken,
      newJti,
      accessTokenExpiresAt,
    );
    await this.tokenService.createRefreshToken(userDto.id, newRefreshToken, refreshTokenExpiresAt);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: userDto,
    };
  }

  async logout(accessToken: string): Promise<void> {
    try {
      // Decodificar el token para obtener el jti
      const decoded = this.jwtService.decode(accessToken);
      if (decoded && decoded.jti) {
        await this.tokenService.revokeAccessTokenByJti(decoded.jti);
      }
    } catch (error) {
      // Si el token no es válido, no necesitamos hacer nada
      console.error('Error decoding token during logout:', error);
    }
  }

  async logoutAll(userId: number): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const tokenRecord = await this.tokenService.findAccessToken(token);
    return !tokenRecord || tokenRecord.isRevoked;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenService.cleanupExpiredTokens();
  }

  private async generateAccessToken(user: UserResponseDto, jti: string): Promise<string> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      jti,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });
  }

  private async generateRefreshToken(user: UserResponseDto): Promise<string> {
    const payload: Omit<JwtPayload, 'jti'> = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: '7d',
    });
  }
}
