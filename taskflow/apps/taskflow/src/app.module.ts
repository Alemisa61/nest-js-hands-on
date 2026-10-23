import { Module, MiddlewareConsumer, NestModule, NotImplementedException } from '@nestjs/common';
import { LoggerMiddleware } from '@app/common/logger/logger.middleware'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import{ConfigModule} from '@nestjs/config'

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
    }),UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
