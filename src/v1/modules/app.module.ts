import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from '@v1/controllers/app.controller';
import { AppService } from '@v1/services/app.service';

import config, { envSchema } from '@/config';

@Module({
  imports: [
    CacheModule.register(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [config],
      validationSchema: envSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class V1AppModule {}
