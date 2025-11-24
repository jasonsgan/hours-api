
import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TimesheetRepository } from './timesheet.repository';

@Module({
  controllers: [TimesheetController],
  providers: [TimesheetService, TimesheetRepository],
})
export class TimesheetModule {}
