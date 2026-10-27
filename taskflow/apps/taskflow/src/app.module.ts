import { Module, MiddlewareConsumer, NestModule, NotImplementedException } from '@nestjs/common';
import { LoggerMiddleware } from '@app/common/logger/logger.middleware'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import{ConfigModule} from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (envConfig) => {
        if (!envConfig.PORT) {
          throw new Error("app will not start port is misising")
        }
        return envConfig;
      }
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal:true,
      ttl:1000
    }),
    UsersModule, AuthModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  EventEmitterModule.forRoot(),
  HealthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService
    , {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
