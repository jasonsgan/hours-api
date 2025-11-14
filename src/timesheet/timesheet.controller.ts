import { 
  Controller, 
  Get, 
  Param, 
  Logger, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimeEntriesDto, TimeEntriesParamsDto} from './dto';

@Controller('timesheet')
export class TimesheetController {
  readonly logger = new Logger(TimesheetController.name); 

  constructor(private readonly timesheetService: TimesheetService) {}

  @Get('entries/:username/:year/:month')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getTimeEntries(@Param() params: TimeEntriesParamsDto): Promise<TimeEntriesDto> {
    return this.timesheetService.getTimeEntries(params.username, params.year, params.month);
  }

}
