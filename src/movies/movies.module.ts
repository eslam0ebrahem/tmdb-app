// src/movie-data/movie-data.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheModule } from '@nestjs/cache-manager';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 600, max: 100 }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.themoviedb.org/3/',
        params: { api_key: configService.get<string>('TMDB_API_KEY') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}