import { Module } from '@nestjs/common';
import { TimeService } from 'src/services/time.service';

@Module({
  providers: [TimeService],
  exports: [TimeService], 
})
export class TimeModule {}