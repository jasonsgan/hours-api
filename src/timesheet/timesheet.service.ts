import { Injectable, Logger } from '@nestjs/common';
import {
  TimeEntriesDto
} from './timesheet.dto';

@Injectable()
export class TimesheetService {
  private readonly logger = new Logger(TimesheetService.name);

  async getTimeEntries(username: string, year: number, month: number): Promise<TimeEntriesDto> {
    this.logger.log(`Fetching time entries for user: ${username}, year: ${year}, month: ${month}`);
    const timeEntriesDto = new TimeEntriesDto();
    return timeEntriesDto;
  }

}
