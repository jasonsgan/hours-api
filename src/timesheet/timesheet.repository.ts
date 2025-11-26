import { Injectable } from '@nestjs/common';
import { TimesheetDto, TimeLogDto, TaskDto } from './dto/timesheet.dto';
import { EditTimesheetDto } from './dto/edit.timesheet.dto';
import { time } from 'console';

@Injectable()
export class TimesheetRepository {

  private timeLogs = new Map<string, TimeLogDto>();

  findTimesheet(username: string, year: number, month: number): TimesheetDto {
    const timesheet = new TimesheetDto();

    const fromDate = new Date(Date.UTC(year, month - 1, 1));
    const toDate =  new Date(Date.UTC(year, month, 1));
    let currentDate = new Date(fromDate);

    while (currentDate < toDate) {
      const isoDate = currentDate.toISOString().split('T')[0];

      let timeLog = this.timeLogs.get(isoDate);
      if (!timeLog) {
        timeLog = new TimeLogDto(isoDate);
        if (!timeLog.weekend()) {
          timeLog.shift = 'Reg';
          timeLog.timeIn = '09:00';
          timeLog.timeOut = '18:30';
          timeLog.tasks.push(new TaskDto('Benoite', 'Corporate Event', 3, 'Lunch at Rals'));
          timeLog.tasks.push(new TaskDto('MC4 BD', 'Proposal Preparation', 5));
        }
        this.timeLogs.set(isoDate, timeLog);
      }
      timesheet.timeLogs.push(timeLog);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return timesheet;
  }

  editTimesheet(username: string, editTimesheet: EditTimesheetDto): void {
    for (const editTimeLog of editTimesheet.timeLogs) {
      const date = editTimeLog.date;
      let timeLog = this.timeLogs.get(date);
      if (!timeLog) {
        timeLog = new TimeLogDto(date);
        this.timeLogs.set(date, timeLog);
      }
      timeLog.timeIn = editTimeLog.timeIn;
      timeLog.timeOut = editTimeLog.timeOut;
      timeLog.remarks = editTimeLog.remarks;
      timeLog.overrideReason = editTimeLog.overrideReason;
    }
  }

}
