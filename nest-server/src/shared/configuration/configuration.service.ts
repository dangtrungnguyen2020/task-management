import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger('ConfigurationService');

  private currentEnv: string = process.env.NODE_ENV || 'development';

  constructor() {
    try {
      const result = dotenv.config();
      if (!result) {
        this.logger.warn('Error loading .env file, using default values');
      }
      this.logger.log(`load application config: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.warn('Error loading .env file, using default values');
    }
  }

  get(key: string): string {
    return process.env[key];
  }

  get port(): string | number {
    return process.env.PORT || 4000;
  }

  get isDevelopment(): boolean {
    return this.currentEnv === 'development';
  }

  get mongoUri(): string {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmng-db';
  }

  get JWT() {
    return {
      Key: process.env.JWT_SECRET || 'DEMO_KEY',
      AccessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL, 10) || 60 * 5, // 5m
      RefreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL, 10) || 30, // 30 Days
    };
  }
}
