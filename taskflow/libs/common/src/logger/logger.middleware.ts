import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction }  from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now()
      res.on('finish', () => {
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        Logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms`,
          'LoggerMiddleware',
        );
      })

    next();
  }
}
