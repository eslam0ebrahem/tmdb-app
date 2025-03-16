import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@ApiTags('Movie Data')
@Controller('movies')
@UseInterceptors(CacheInterceptor)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get popular movies' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of popular movies'})
  @Get('popular')
  async getPopularMovies(@Query('page') page = 1) {
    return this.moviesService.getPopularMovies(page);
  }

  @ApiOperation({ summary: 'Get top rated movies' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of top-rated movies'})
  @Get('top-rated')
  async getTopRatedMovies(@Query('page') page = 1) {
    return this.moviesService.getTopRatedMovies(page);
  }

  @ApiOperation({ summary: 'Get upcoming movies' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of upcoming movies'})
  @Get('upcoming')
  async getUpcomingMovies(@Query('page') page = 1) {
    return this.moviesService.getUpcomingMovies(page);
  }

  @ApiOperation({ summary: 'Search for movies based on query' })
  @ApiQuery({ name: 'query', required: true, description: 'Search term for movies' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination (default: 1)' })
  @ApiResponse({ status: 200, description: 'List of movies matching search query'})
  @Get('search')
  async searchMovies(@Query('query') query: string, @Query('page') page = 1) {
    return this.moviesService.searchMovies(query, page);
  }

  @ApiOperation({ summary: 'Get details of a specific movie' })
  @ApiParam({ name: 'movieId', type: Number, description: 'Unique identifier of the movie' })
  @ApiResponse({ status: 200, description: 'Details of the movie' })
  @Get(':movieId')
  async getMovieDetails(@Param('movieId') movieId: number) {
    return this.moviesService.getMovieDetails(movieId);
  }
}
