import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [    ConfigModule.forRoot(), 
      CacheModule.register({
          ttl: 600, 
          max: 100, 
        }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.themoviedb.org/3/',
        params: {
          api_key: configService.get<string>('TMDB_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TrendingController],
  providers: [TrendingService],
})
export class TrendingModule {}