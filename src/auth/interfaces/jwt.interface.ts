// JWT Payload interfaces
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface JwtUser {
  id: number;
  email: string;
  role: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  refreshToken: string;
}
