import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class TimeEntriesParamsDto {
  @IsString()
  @IsNotEmpty({message: 'Username must be a non-empty string'})
  username: string;

  @Type(() => Number)
  @IsInt({message: 'Year must be an integer'}) 
  @Min(2000, {message: 'Year must be at least 2000'})
  @Max(2100, {message: 'Year must be at most 2100'})
  year: number;
 
  @Type(() => Number)
  @IsInt({message: 'Month must be an integer'})
  @Min(1, {message: 'Month must be at least 1'})
  @Max(12, {message: 'Month must be at most 12'})
  month: number;
}

export class TimeEntriesDto {
  timeEntries: TimeEntryDto[] = [];
}

export class TimeEntryDto {
  date: string; // ISO date string
  timeIn: string; // HH:mm format
  timeOut: string; // HH:mm format
  tasks: TaskEntryDto[] = [];

  getHoursWorked(): number {
    const tasks = this.tasks || [];
    let totalHours = 0;
    for (const task of tasks) {  
      totalHours += task.hours;
    }
    return totalHours;
  }
}

export class TaskEntryDto {
  projectName: string;
  taskName: string;
  hours: number = 0;
  taskDescription?: string;
}
