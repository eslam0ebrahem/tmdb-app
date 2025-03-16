import { Body, Controller, Delete, Param, Post, UseInterceptors } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { MovieRatingDto, TvRatingDto } from './dto/rating.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Ratings')
@Controller('ratings')
@UseInterceptors(CacheInterceptor)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @ApiOperation({ summary: 'Rate a movie' })
  @ApiParam({ name: 'movieId', type: Number, description: 'Unique identifier for the movie to be rated' })
  @ApiBody({
    description: 'Rating value for the movie',
    examples: {
      'application/json': {
        value: {
          value: 8.5,
        },
        description: 'Example of rating a movie with a score of 8.5',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Movie rated successfully', type: String })
  @Post('movie/:movieId')
  async rateMovie(@Param('movieId') movieId: number, @Body() dto: MovieRatingDto) {
    return this.ratingsService.rateMovie(movieId, dto.value);
  }

  @ApiOperation({ summary: 'Delete movie rating' })
  @ApiParam({ name: 'movieId', type: Number, description: 'Unique identifier for the movie whose rating is to be deleted' })
  @ApiResponse({ status: 200, description: 'Movie rating deleted successfully', type: String })
  @Delete('movie/:movieId')
  async deleteMovieRating(@Param('movieId') movieId: number) {
    return this.ratingsService.deleteMovieRating(movieId);
  }

  @ApiOperation({ summary: 'Rate a TV show' })
  @ApiParam({ name: 'seriesId', type: Number, description: 'Unique identifier for the TV show to be rated' })
  @ApiBody({
    description: 'Rating value for the TV show',
    examples: {
      'application/json': {
        value: {
          value: 9.0,
        },
        description: 'Example of rating a TV show with a score of 9.0',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'TV show rated successfully', type: String })
  @Post('tv/:seriesId')
  async rateTvShow(@Param('seriesId') seriesId: number, @Body() dto: TvRatingDto) {
    return this.ratingsService.rateTvShow(seriesId, dto.value);
  }

  @ApiOperation({ summary: 'Delete TV rating' })
  @ApiParam({ name: 'seriesId', type: Number, description: 'Unique identifier for the TV show whose rating is to be deleted' })
  @ApiResponse({ status: 200, description: 'TV show rating deleted successfully', type: String })
  @Delete('tv/:seriesId')
  async deleteTvRating(@Param('seriesId') seriesId: number) {
    return this.ratingsService.deleteTvRating(seriesId);
  }
}
