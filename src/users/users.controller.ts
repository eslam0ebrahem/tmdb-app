import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

class FavoriteDto { mediaId: number; favorite: boolean; }
class WatchlistDto { mediaId: number; watchlist: boolean; }

@ApiTags('User Data')
@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Add/remove from favorites' })
  @ApiBody({ 
    description: 'Media ID and favorite status (true to add, false to remove)',
    examples: {
      'application/json': {
        value: {
          mediaId: 123,
          favorite: true
        },
        description: 'Example of adding a movie to favorites'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Favorite updated successfully', type: String })
  @Post('favorites')
  async updateFavorite(@Body() dto: FavoriteDto) {
    return this.usersService.addToFavorites(dto.mediaId, dto.favorite);
  }

  @ApiOperation({ summary: 'Add/remove from watchlist' })
  @ApiBody({ 
    description: 'Media ID and watchlist status (true to add, false to remove)',
    examples: {
      'application/json': {
        value: {
          mediaId: 456,
          watchlist: false
        },
        description: 'Example of removing a movie from the watchlist'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Watchlist updated successfully', type: String })
  @Post('watchlist')
  async updateWatchlist(@Body() dto: WatchlistDto) {
    return this.usersService.addToWatchlist(dto.mediaId, dto.watchlist);
  }

  @ApiOperation({ summary: 'Get favorite movies' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of favorite movies', type: [String] })
  @Get('favorites/movies')
  async getFavoriteMovies(@Query('page') page: number = 1) {
    return this.usersService.getFavoriteMovies(page);
  }

  @ApiOperation({ summary: 'Get favorite TV shows' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of favorite TV shows', type: [String] })
  @Get('favorites/tv')
  async getFavoriteTvShows(@Query('page') page: number = 1) {
    return this.usersService.getFavoriteTvShows(page);
  }

  @ApiOperation({ summary: 'Get watchlist movies' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of watchlist movies', type: [String] })
  @Get('watchlist/movies')
  async getWatchlistMovies(@Query('page') page: number = 1) {
    return this.usersService.getWatchlistMovies(page);
  }

  @ApiOperation({ summary: 'Get watchlist TV shows' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of watchlist TV shows', type: [String] })
  @Get('watchlist/tv')
  async getWatchlistTvShows(@Query('page') page: number = 1) {
    return this.usersService.getWatchlistTvShows(page);
  }

  @ApiOperation({ summary: 'Get account details' })
  @ApiResponse({ status: 200, description: 'Account details retrieved successfully', type: Object })
  @Get('account')
  async getAccountDetails() {
    return this.usersService.getAccountDetails();
  }
}
