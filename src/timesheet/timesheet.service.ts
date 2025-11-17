import { Injectable, Logger } from '@nestjs/common';
import {
  TimesheetDto,
  TimeLogDto,
  TaskDto
} from './dto/timesheet.dto';

@Injectable()
export class TimesheetService {
  private readonly logger = new Logger(TimesheetService.name);

  async getTimesheetByMonth(username: string, year: number, month: number): Promise<TimesheetDto> {
    this.logger.log(`Fetching time entries for user: ${username}, year: ${year}, month: ${month}`);

    const fromDate = new Date(Date.UTC(year, month - 1, 1));
    const toDate =  new Date(Date.UTC(year, month, 1));
    let currentDate = new Date(fromDate);

    const timesheet = new TimesheetDto();

    while (currentDate < toDate) {
      const isoDate = currentDate.toISOString().split('T')[0];

      const timeLog = new TimeLogDto(isoDate, '09:00', '18:30');
      timeLog.tasks.push(new TaskDto('Benoite', 'Corporate Event', 3, 'Lunch at Rals'));
      timeLog.tasks.push(new TaskDto('MC4 BD', 'Proposal Preparation', 5));
      
      timesheet.timeLogs.push(timeLog);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return timesheet
  }

}
