import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import{ConfigModule} from '@nestjs/config'
import { config } from 'process';

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
export class AppModule {}
