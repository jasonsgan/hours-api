import { Injectable, Logger } from '@nestjs/common';
import { TimesheetRepository } from './timesheet.repository';
import { TimesheetDto } from './dto/timesheet.dto';
import { EditTimesheetDto } from './dto/edit.timesheet.dto';

@Injectable()
export class TimesheetService {
  private readonly logger = new Logger(TimesheetService.name);

  constructor(private readonly timesheetRepository: TimesheetRepository) {}

  async findTimesheet(username: string, year: number, month: number): Promise<TimesheetDto> {
    this.logger.log(`Fetching time entries for user: ${username}, year: ${year}, month: ${month}`);
    return this.timesheetRepository.findTimesheet(username, year, month);
  }

  async editTimesheet(username: string, editTimesheetDto: EditTimesheetDto): Promise<void> {
    this.logger.log(`Editing timesheet for user: ${username}`);
    this.timesheetRepository.editTimesheet(username, editTimesheetDto);
  }
}
