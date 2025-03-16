import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { TrendingModule } from './trending/trending.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { RatingsModule } from './ratings/ratings.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'global',
      ttl: 60000, 
      limit: 100, 
    }]),
    CacheModule.register({
      ttl: 600, 
      max: 100, 
    }),
    MoviesModule, TrendingModule, RatingsModule, UsersModule
  ]
})
export class AppModule {}