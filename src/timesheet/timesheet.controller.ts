import { 
  Controller, 
  Get, 
  Put,
  Body,
  Param, 
  Logger, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TimesheetService } from './timesheet.service';
import { TimesheetDto, MonthParamsDto} from './dto/timesheet.dto';
import { EditTimesheetDto } from './dto/edit.timesheet.dto';

@Controller('timesheet')
export class TimesheetController {
  readonly logger = new Logger(TimesheetController.name); 

  constructor(private readonly timesheetService: TimesheetService) {}

  @ApiOkResponse({ type: TimesheetDto, description: 'Timesheet data for the specified month' })
  @Get(':username/:year/:month')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getTimesheetByMonth(@Param() params: MonthParamsDto): Promise<TimesheetDto> {
    return this.timesheetService.findTimesheet(params.username, params.year, params.month);
  }

  @Put(':username')
  async editTimesheet(@Param('username') username, @Body() editTimesheetDto: EditTimesheetDto): Promise<void> {
    this.timesheetService.editTimesheet(username, editTimesheetDto);
  }

}
