import { Injectable, Logger } from '@nestjs/common';
import { TimesheetDto, TimeLogDto, TaskDto } from './dto/timesheet.dto';
import { EditTimesheetDto } from './dto/edit.timesheet.dto';
import { time } from 'console';
import { prisma } from 'src/utils/prisma';
import { TaskModel } from '../generated/prisma/models/Task'
import { TimeLogModel } from '../generated/prisma/models/TimeLog'
import { Prisma } from '../generated/prisma/client';
import { isWeekend } from 'src/utils/date.utils';

export type TimeLogWithTasks = Prisma.TimeLogGetPayload<{ include: { tasks: true } }>;
export type TimeLog = Prisma.TimeLogGetPayload<{}>;

@Injectable()
export class TimesheetRepository {
  private readonly logger = new Logger(TimesheetRepository.name);

  async findTimeLogs(userId: string, year: number, month: number): Promise<TimeLogWithTasks[]> {
    const fromDate = new Date(Date.UTC(year, month - 1, 1));
    const toDate =  new Date(Date.UTC(year, month, 1));

    const findOptions = {
      where: {
        userId,
        date: {
          gte: fromDate,
          lt: toDate
        }
      },
      orderBy:{ date: Prisma.SortOrder.asc },
      include: {
        tasks: true 
      }
    };

    let timeLogs = await prisma.timeLog.findMany(findOptions);
    if (!timeLogs || timeLogs.length === 0) {
      this.logger.log(`No time logs found for period ${fromDate}-${toDate}. Creating time logs...`);
      await this.createTimesheet(userId, fromDate, toDate);
      timeLogs = await prisma.timeLog.findMany(findOptions);
    } else {
      this.logger.log(`Time logs found for period ${fromDate}-${toDate}.`);
    }

    return timeLogs;
  }
/*
  async createTimesheet(userId, fromDate: Date, toDate: Date) {
    this.logger.log(`Creating timesheet: userId=${userId} fromDate=${fromDate} toDate=${toDate}`);
    
    let currentDate = new Date(fromDate);
    let timeLogs: any[] = [];
    while (currentDate < toDate) {
      const weekend = isWeekend(currentDate);
      timeLogs.push({
          userId,
          date: new Date(currentDate),
          timeIn: !weekend ? '09:00' : undefined,
          timeOut: !weekend ? '18:30' : undefined        
      })
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    await prisma.timeLog.createMany({ data: timeLogs });

    currentDate = new Date(fromDate);
    let tasks: any[] = [];
    while (currentDate < toDate) {
      const weekend = isWeekend(currentDate);
      tasks.push({
        userId,
        date: new Date(currentDate),
        timeIn: !weekend ? '09:00' : undefined,
        timeOut: !weekend ? '18:30' : undefined
      });
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    await prisma.task.createMany({ data: tasks });
  }
*/
  async createTimesheet(userId, fromDate: Date, toDate: Date) {
    this.logger.log(`Creating timesheet: userId=${userId} fromDate=${fromDate} toDate=${toDate}`);
    
    let currentDate = new Date(fromDate);
    let timeLogs: Promise<any>[] = [];
    while (currentDate < toDate) {
      const weekend = isWeekend(currentDate);
      timeLogs.push(prisma.timeLog.create({ 
        data: {
          userId,
          date: new Date(currentDate),
          timeIn: !weekend ? '09:00' : undefined,
          timeOut: !weekend ? '18:30' : undefined        
        }
      }));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    await Promise.all(timeLogs);

    currentDate = new Date(fromDate);
    let tasks: Promise<any>[] = [];
    while (currentDate < toDate) {
      const weekend = isWeekend(currentDate);
      if (weekend) {
        tasks.push(prisma.task.create({ 
          data: {
            userId,
            date: new Date(currentDate),
            projectName: 'Benoite',
            taskName: 'Corporate Event',
            taskDescription: 'Lunch at Rals',
            hours: 3
          } 
        }));
        tasks.push(prisma.task.create({ 
          data: {
            userId,
            date: new Date(currentDate),
            projectName: 'Benoite',
            taskName: 'Corporate Event',
            taskDescription: 'Lunch at Rals',
            hours: 3
          } 
        }));
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    await Promise.all(tasks);
  }

  async editTimesheet(timeLogs: TimeLog[]): Promise<void> {
    const updates: Promise<any>[] = [];

    for (const timeLog of timeLogs) {
      const update =
        prisma.timeLog.update({
          where: {  
            userId_date: {
              userId: timeLog.userId,
              date: timeLog.date
            }
          },
          data: {
            timeIn: timeLog.timeIn,
            timeOut: timeLog.timeOut,
            remarks: timeLog.remarks,
            overrideReason: timeLog.overrideReason
          }
        });
      updates.push(update);
    }

    await Promise.all(updates);
  }

}
