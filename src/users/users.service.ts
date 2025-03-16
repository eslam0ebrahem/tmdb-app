import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
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

  async addToFavorites(mediaId: number, favorite: boolean) {
    const accountId = this.configService.get<string>('TMDB_ACCOUNT_ID');
    const response = await firstValueFrom(
      this.httpService.post(
        `account/${accountId}/favorite`,
        { media_type: 'movie', media_id: mediaId, favorite },
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async addToWatchlist(mediaId: number, watchlist: boolean) {
    const accountId = this.configService.get<string>('TMDB_ACCOUNT_ID');
    const response = await firstValueFrom(
      this.httpService.post(
        `account/${accountId}/watchlist`,
        { media_type: 'movie', media_id: mediaId, watchlist },
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  private getAccountId() {
    return this.configService.get<string>('TMDB_ACCOUNT_ID');
  }

  async getFavoriteMovies(page: number) {
    const response = await firstValueFrom(
      this.httpService.get(
        `account/${this.getAccountId()}/favorite/movies?page=${page}`, 
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async getFavoriteTvShows(page: number) {
    const response = await firstValueFrom(
      this.httpService.get(
        `account/${this.getAccountId()}/favorite/tv?page=${page}`, 
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async getWatchlistMovies(page: number) {
    const response = await firstValueFrom(
      this.httpService.get(
        `account/${this.getAccountId()}/watchlist/movies?page=${page}`, 
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async getWatchlistTvShows(page: number) {
    const response = await firstValueFrom(
      this.httpService.get(
        `account/${this.getAccountId()}/watchlist/tv?page=${page}`, 
        { headers: this.getAuthHeaders() }
      )
    );
    return response.data;
  }

  async getAccountDetails() {
    const response = await firstValueFrom(
      this.httpService.get(`account/${this.getAccountId()}`, {
        headers: this.getAuthHeaders()
      })
    );
    return response.data;
  }
}
