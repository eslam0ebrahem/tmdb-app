import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RatingsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.configService.get('TMDB_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    };
  }

  async rateMovie(movieId: number, value: number) {
    const response = await firstValueFrom(
      this.httpService.post(
        `movie/${movieId}/rating`,
        { value },
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async deleteMovieRating(movieId: number) {
    const response = await firstValueFrom(
      this.httpService.delete(
        `movie/${movieId}/rating`,
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async rateTvShow(seriesId: number, value: number) {
    const response = await firstValueFrom(
      this.httpService.post(
        `tv/${seriesId}/rating`,
        { value },
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async deleteTvRating(seriesId: number) {
    const response = await firstValueFrom(
      this.httpService.delete(
        `tv/${seriesId}/rating`,
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }
}