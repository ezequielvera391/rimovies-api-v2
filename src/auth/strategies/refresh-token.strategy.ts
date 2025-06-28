import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload, RefreshTokenPayload } from '../interfaces/jwt.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshTokenPayload {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
