import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TrendingService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,  // Inject CACHE_MANAGER
  ) {}

  private async fetchTrendingData(
    cacheKey: string,
    path: string,
    page: number = 1,
    params: Record<string, any> = {}
  ) {
    
    const response = await firstValueFrom(
      this.httpService.get(path, { params: { ...params, page } })
    );

    const data = {
      results: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };

    return data;
  }

  async getAllTrending(page: number = 1) {
    return this.fetchTrendingData('trending_all', 'trending/all/day', page, {
      language: 'en-US',
    });
  }

  async getMovieTrending(page: number = 1) {
    return this.fetchTrendingData('trending_movies', 'trending/movie/day', page, {
      language: 'en-US',
    });
  }
}