import moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimeService {
  private readonly defaultTimezone: string;

  constructor(private configService: ConfigService) {
    this.defaultTimezone = this.configService.get<string>('TIMEZONE') || 'UTC'; 
  }

  getCurrentTime(): string {
    return moment().tz(this.defaultTimezone).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }

  getCurrentTimeInTimezone(timezone: string): string {
    return moment().tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }
}