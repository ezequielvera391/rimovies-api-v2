import { ConfigService } from '@nestjs/config';

export function getEnv(config: ConfigService, key: string): string {
  const value = config.get<string>(key);
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
}
