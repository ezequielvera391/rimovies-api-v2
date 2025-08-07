import { JwtUser } from './jwt.interface';
import { RegisterDto } from '../dto/register.dto';

// Auth service interfaces
export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Auth service method interfaces
export interface IAuthService {
  validateUser(email: string, password: string): Promise<JwtUser>;
  register(registerDto: RegisterDto): Promise<JwtUser>;
  login(user: JwtUser): Promise<TokenPair & { user: JwtUser }>;
  refreshTokens(refreshToken: string): Promise<TokenPair & { user: JwtUser }>;
  logout(token: string): Promise<void>;
  logoutAll(userId: number): Promise<void>;
  isTokenRevoked(token: string): Promise<boolean>;
  cleanupExpiredTokens(): Promise<void>;
}
