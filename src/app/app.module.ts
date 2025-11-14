import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { pino } from 'pino';
import { FastifyRequest, FastifyReply } from 'fastify';
import { uuidv7 } from 'uuidv7';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimesheetModule } from '../timesheet/timesheet.module';

const PinoLoggerModule = LoggerModule.forRoot({
  pinoHttp: {

    base: null,
    timestamp: pino.stdTimeFunctions.isoTime,

    transport:
      // log format is pino-pretty for dev, json for prod
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,

    level: process.env.NODE_ENV !== 'production' ? 'trace' : 'info',

    formatters: {
      level(label) {
        return { level: label };
      },
    },

    serializers: {
      req(req) {
        return {
          id: uuidv7(),
          method: req.method,
          url: req.url
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
      err(err) {
        if (err && err.message === 'failed with status code 500') {
          return undefined;
        }
        return err;
      }
    },

    autoLogging: {
      // You can also disable auto-logging completely with autoLogging: false
      ignore: (req) => {
        const excludedPaths = [
          '/health',
          '/metrics',
          '/swagger',
        ];
        const url = (req as unknown as FastifyRequest).originalUrl;
        return excludedPaths.some((path) => url.includes(path));
      },
    },

  },
});

@Module({
  imports: [PinoLoggerModule, TimesheetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
