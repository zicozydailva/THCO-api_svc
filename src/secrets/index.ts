import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretsService extends ConfigService {
  constructor() {
    super();
  }

  NODE_ENV = this.get<string>('NODE_ENV');
  KAFKA_BROKER = this.get('KAFKA_BROKER');
  SERVER_APP_URL = this.get('SERVER_APP_URL');

  get mailSecret() {
    return {
      MAIL_USERNAME: this.get('MAIL_USERNAME'),
      MAIL_PASSWORD: this.get('MAIL_PASSWORD'),
      MAIL_HOST: this.get('MAIL_HOST'),
      MAIL_PORT: this.get('MAIL_PORT'),
    };
  }

  get jwtSecret() {
    return {
      JWT_SECRET: this.get('APP_SECRET'),
      JWT_EXPIRES_IN: this.get('ACCESS_TOKEN_EXPIRES', '1h'),
    };
  }

  get appPorts() {
    return {
      AUTH_SERVICE_PORT: this.get('AUTH_SERVICE_PORT'),
      CAREER_SERVICE_PORT: this.get('CAREER_SERVICE_PORT'),
      NOTIFICATION_SERVICE_PORT: this.get('NOTIFICATION_SERVICE_PORT'),
      SESSION_SERVICE_PORT: this.get('SESSION_SERVICE_PORT'),
      PAYMENT_SERVICE_PORT: this.get('PAYMENT_SERVICE_PORT'),
      COMMUNITY_SERVICE_PORT: this.get('COMMUNITY_SERVICE_PORT'),
      CHAT_SERVICE_PORT: this.get('CHAT_SERVICE_PORT'),
    };
  }

  get database() {
    return {
      host: this.get('MONGO_HOST'),
      user: this.get('MONGO_ROOT_USERNAME'),
      pass: this.get('MONGO_ROOT_PASSWORD'),
    };
  }

  get userSessionRedis() {
    return {
      REDIS_HOST: this.get('REDIS_HOST'),
      REDIS_USER: this.get('REDIS_USER'),
      REDIS_PASSWORD: this.get('REDIS_PASSWORD'),
      REDIS_PORT: this.get('REDIS_PORT'),
    };
  }
}
