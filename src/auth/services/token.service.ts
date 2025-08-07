import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { AccessToken } from '../entities/access-token.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
  ) {}

  async createRefreshToken(userId: number, token: string, expiresAt: Date): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async createAccessToken(userId: number, token: string, jti: string, expiresAt: Date): Promise<AccessToken> {
    const accessToken = this.accessTokenRepository.create({
      userId,
      token,
      jti,
      expiresAt,
    });
    return this.accessTokenRepository.save(accessToken);
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });
  }

  async findAccessToken(token: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });
  }

  async findAccessTokenByJti(jti: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({
      where: { jti, isRevoked: false },
      relations: ['user'],
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }

  async revokeAccessToken(token: string): Promise<void> {
    await this.accessTokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }

  async revokeAccessTokenByJti(jti: string): Promise<void> {
    await this.accessTokenRepository.update(
      { jti },
      { isRevoked: true }
    );
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId },
      { isRevoked: true }
    );
    await this.accessTokenRepository.update(
      { userId },
      { isRevoked: true }
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    
    // Eliminar refresh tokens expirados
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(now),
    });

    // Eliminar access tokens expirados
    await this.accessTokenRepository.delete({
      expiresAt: LessThan(now),
    });
  }

  generateJti(): string {
    return randomUUID();
  }
}
