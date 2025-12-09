import { Injectable, Logger } from '@nestjs/common';
import { TimesheetRepository } from './timesheet.repository';
import { TimesheetDto, TimeLogDto, TaskDto } from './dto/timesheet.dto';
import { EditTimesheetDto } from './dto/edit.timesheet.dto';
import { prisma } from 'src/utils/prisma';
import { TimeLogModel } from '../generated/prisma/models/TimeLog';
import { Prisma } from '../generated/prisma/client';
import { TimeLogWithTasks } from './timesheet.repository';
import { timeLog } from 'console';


@Injectable()
export class TimesheetService {
  private readonly logger = new Logger(TimesheetService.name);

  constructor(private readonly timesheetRepository: TimesheetRepository) {
  }

  async findTimesheet(userId: string, year: number, month: number): Promise<TimesheetDto> {
    this.logger.log(`Fetching time entries for user: ${userId}, year: ${year}, month: ${month}`);
    
    const timeLogs = await this.timesheetRepository.findTimeLogs(userId, year, month);

    const timesheet = new TimesheetDto();
    for (const timeLog of timeLogs) {
      const timeLogDto = new TimeLogDto(timeLog.date.toISOString().split('T')[0]);
      timeLogDto.timeIn = timeLog.timeIn;
      timeLogDto.timeOut = timeLog.timeOut;
      timeLogDto.remarks = timeLog.remarks;
      timeLogDto.overrideReason = timeLog.overrideReason; 
      for (const task of timeLog.tasks) {
        const taskDto = new TaskDto();
        taskDto.hours = task.hours;
        taskDto.taskDescription = task.taskDescription;
        taskDto.taskName = task.taskName;
        taskDto.projectName = task.projectName;
        timeLogDto.tasks.push(taskDto);
      }
      timesheet.timeLogs.push(timeLogDto);
    }

    return timesheet;
  }

  async editTimesheet(userId: string, editTimesheetDto: EditTimesheetDto): Promise<void> {
    this.logger.log(`Editing timesheet for user: ${userId}`);

    const timeLogs = editTimesheetDto.timeLogs.map(timeLogDto => {
      return {
        ...timeLogDto,
        userId,
        date: new Date(timeLogDto.date)
      };
    });

    await this.timesheetRepository.editTimesheet(timeLogs);
  }

}
