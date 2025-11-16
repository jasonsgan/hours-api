import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
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
  constructor(projectName: string, taskName: string, hours: number, taskDescription?: string) {
    this.projectName = projectName;
    this.taskName = taskName;
    this.hours = hours;
    this.taskDescription = taskDescription;
  }
  
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
  taskDescription?: string;
}

export class TimeLogDto {
  constructor(date: string, timeIn: string, timeOut: string) {
    this.date = date;
    this.timeIn = timeIn;
    this.timeOut = timeOut;
  }

  @ApiProperty({
    description: 'Date in ISO format',
    example: '2025-09-15'
  })
  date: string;

  @ApiProperty({
    description: 'First time-in of the day in 24-hour HH:mm format',
    example: '09:00'
  })
  timeIn: string;

  @ApiProperty({
    description: 'Last time-out of the day in 24-hour HH:mm format',
    example: '18:00'
  })
  timeOut: string;

  @ApiProperty({
    type: [TaskDto],
    description: 'Array of tasks worked on that day'
  })
  tasks: TaskDto[] = [];

  getHoursWorked(): number {
    const tasks = this.tasks || [];
    let totalHours = 0;
    for (const task of tasks) {  
      totalHours += task.hours;
    }
    return totalHours;
  }
}

export class TimesheetDto {
  @ApiProperty({
    type: [TimeLogDto],
    description: 'Array of time logs (daily time records)'
  })
  timeLogs: TimeLogDto[] = [];
}

