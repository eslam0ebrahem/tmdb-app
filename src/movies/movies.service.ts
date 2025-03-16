// src/movie-data/movie-data.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  constructor(private readonly httpService: HttpService) {}

  private async fetchPaginatedData(url: string, page: number, params: Record<string, any> = {}) {
    const response = await firstValueFrom(
      this.httpService.get(url, { params: { page, ...params } })
    );
    
    return {
      results: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
  }

  async getPopularMovies(page = 1) {
    return this.fetchPaginatedData('movie/popular', page);
  }

  async getTopRatedMovies(page = 1) {
    return this.fetchPaginatedData('discover/movie', page, {
      sort_by: 'vote_average.desc',
      without_genres: '99,10755',
      'vote_count.gte': 200,
    });
  }

  async getUpcomingMovies(page = 1) {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    
    return this.fetchPaginatedData('discover/movie', page, {
      sort_by: 'popularity.desc',
      with_release_type: '2|3',
      'release_date.gte': today.toISOString().split('T')[0],
      'release_date.lte': nextMonth.toISOString().split('T')[0],
    });
  }
  
  async searchMovies(query: string, page = 1) {
    return this.fetchPaginatedData('search/movie', page, {
      query,
      include_adult: true,
      language: 'en-US',
    });
  }
  async getMovieDetails(movieId: number) {
    const response = await firstValueFrom(
      this.httpService.get(`movie/${movieId}`)
    );
    return response.data;
  }
}