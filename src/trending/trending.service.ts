import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TrendingService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  private async fetchTrendingData(
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
    return this.fetchTrendingData( 'trending/all/day', page, {
      language: 'en-US',
    });
  }

  async getMovieTrending(page: number = 1) {
    return this.fetchTrendingData( 'trending/movie/day', page, {
      language: 'en-US',
    });
  }
}