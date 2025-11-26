import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EditTimeLogDto {

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
    description: 'General remarks',
    example: 'Official Business'
  })
  remarks: string;  

  @ApiProperty({
    description: 'Reason for overriding time entries',
    example: 'WFH'
  })
  overrideReason: string;  
}

export class EditTimesheetDto {
  @ApiProperty({
    type: [EditTimeLogDto],
    description: 'Array of time logs (daily time records)'
  })
  timeLogs: EditTimeLogDto[] = [];
}

