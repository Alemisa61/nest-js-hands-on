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
    }), UsersModule, AuthModule,
  ThrottlerModule.forRoot([{ttl:60000, limit: 10}])],
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
