import { Injectable } from '@nestjs/common';
import { TimesheetDto, TimeLogDto, TaskDto } from './dto/timesheet.dto';
import { EditTimesheetDto } from './dto/edit.timesheet.dto';
import { time } from 'console';
import { prisma } from 'src/utils/prisma';
import { TaskModel } from '../generated/prisma/models/Task'
import { TimeLogModel } from '../generated/prisma/models/TimeLog'
import { Prisma } from '../generated/prisma/client';
import { isWeekend } from 'src/utils/date.utils';

const userId = '1';

export type TimeLogWithTasks = Prisma.TimeLogGetPayload<{ include: { tasks: true } }>;
export type TimeLog = Prisma.TimeLogGetPayload<{}>;

@Injectable()
export class TimesheetRepository {

  async findTimeLogs(username: string, year: number, month: number): Promise<TimeLogWithTasks[]> {
    const fromDate = new Date(Date.UTC(year, month - 1, 1));
    const toDate =  new Date(Date.UTC(year, month, 1));

    const findOptions = {
      where: {
        userId: '1',
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
      await this.createTimesheet(fromDate, toDate);
      timeLogs = await prisma.timeLog.findMany(findOptions);
    }

    return timeLogs;
  }

  async createTimesheet(fromDate: Date, toDate: Date) {
    let currentDate = new Date(fromDate);

    while (currentDate < toDate) {
      const weekend = isWeekend(currentDate);

      await prisma.timeLog.create({
        data: {
          userId,
          date: currentDate,
          timeIn: !weekend ? '09:00' : undefined,
          timeOut: !weekend ? '18:30' : undefined
        }
      });

      if (!weekend) {
        await prisma.task.create({
          data: {
            userId,
            date: currentDate,
            projectName: 'Benoite',
            taskName: 'Corporate Event',
            hours: 3,
            taskDescription: 'Lunch at Rals'
          }
        });

        await prisma.task.create({
          data: {
            userId,
            date: currentDate,
            projectName: 'MC4 BD',
            taskName: 'Proposal Preparation',
            hours: 5
          }
        });
      }

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
  }


  async editTimesheet(timeLogs: TimeLog[]): Promise<void> {
    for (const timeLog of timeLogs) {

      console.log('Updating timeLog:', timeLog);

      await prisma.timeLog.update({
        where: {  
          userId_date: {
            userId,
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
    }
  }

}
