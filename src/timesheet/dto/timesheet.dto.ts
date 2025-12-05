import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MonthParamsDto {
  @ApiProperty({
    description: 'Username of the employee',
    example: 'bruce.wayne',

  })
  @IsString()
  @IsNotEmpty({message: 'Username must be a non-empty string'})
  username: string;

  @ApiProperty({
    description: 'Four-digit year',
    example: '2025',
  })
  @Type(() => Number)
  @IsInt({message: 'Year must be an integer'}) 
  @Min(2000, {message: 'Year must be at least 2000'})
  @Max(2100, {message: 'Year must be at most 2100'})
  year: number;
 
  @ApiProperty({
    description: 'Month of the year (1-12)',
    example: '9',
  })
  @Type(() => Number)
  @IsInt({message: 'Month must be an integer'})
  @Min(1, {message: 'Month must be at least 1'})
  @Max(12, {message: 'Month must be at most 12'})
  month: number;
}

export class TaskDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Benoite'
  })
  projectName: string;

  @ApiProperty({
    description: 'Task name',
    example: 'Corporate event'
  })  
  taskName: string;

  @ApiProperty({
    description: 'Hours spent on the task',
    example: 4.5
  })  
  hours: number = 0;

  @ApiProperty({
    description: 'Additional information about the task',
    example: 'Attended Softcon 2025 conference'
  })  
  taskDescription: string | null;
}

export class TimeLogDto {
  constructor(date: string) {
    this.date = date;
  }

  @ApiProperty({
    description: 'Date in ISO format',
    example: '2025-09-15'
  })
  date: string;

  @ApiProperty({
    description: 'Shift type (e.g. Reg)',
    example: 'Reg'
  })
  shift: string;

  @ApiProperty({
    description: 'First time-in of the day in 24-hour HH:mm format',
    example: '09:00'
  })
  timeIn: string | null;

  @ApiProperty({
    description: 'Last time-out of the day in 24-hour HH:mm format',
    example: '18:00'
  })
  timeOut: string | null;

  @ApiProperty({
    description: 'General remarks',
    example: 'Official Business'
  })
  remarks: string | null;  

  @ApiProperty({
    description: 'Reason for overriding time entries',
    example: 'WFH'
  })
  overrideReason: string | null;  

  @ApiProperty({
    description: 'Elapsed time between time-in and time-out',
    example: '9:19',
    type: String
  })
  @Expose()
  elapsedTime(): string {
    if (!this.timeIn || !this.timeOut) {
      return '0:00';
    }
    const inDate = new Date(`1970-01-01T${this.timeIn}:00Z`);
    const outDate = new Date(`1970-01-01T${this.timeOut}:00Z`);
    if (outDate < inDate) {
      outDate.setUTCDate(outDate.getUTCDate() + 1);
    }
    const elapsedMs = outDate.getTime() - inDate.getTime();
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${elapsedHours}:${elapsedMinutes.toString().padStart(2, '0')}`;
  }

  @ApiProperty({
    description: 'Total hours from all tasks worked on that day',
    example: 8,
    type: Number
  })
  @Expose()
  workedHours(): number {
    const tasks = this.tasks || [];
    let totalHours = 0;
    for (const task of tasks) {  
      totalHours += task.hours;
    }
    return totalHours;
  }

  @ApiProperty({
    description: 'Returns true if a weekend, false otherwise',
    example: false,
    type: Boolean
  })
  @Expose()
  weekend(): boolean {
    const date = new Date(this.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  @ApiProperty({
    type: [TaskDto],
    description: 'Array of tasks worked on that day'
  })
  tasks: TaskDto[] = [];

}

export class TimesheetDto {
  @ApiProperty({
    type: [TimeLogDto],
    description: 'Array of time logs (daily time records)'
  })
  timeLogs: TimeLogDto[] = [];
}

