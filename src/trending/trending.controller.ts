import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Trending')
@Controller('trending')
@UseInterceptors(CacheInterceptor)
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @ApiOperation({ summary: 'Get all trending content' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number for pagination (default: 1)' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of all trending content',
    type: [String], // Adjust the type to your actual response format (e.g., Movie, TV Show models)
  })
  @Get('all')
  async getAllTrending(@Query('page') page = 1) {
    return this.trendingService.getAllTrending(page);
  }

  @ApiOperation({ summary: 'Get trending movies' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number for pagination (default: 1)' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of trending movies',
    type: [String], // Adjust the type to your actual response format (e.g., Movie models)
  })
  @Get('movies')
  async getMovieTrending(@Query('page') page = 1) {
    return this.trendingService.getMovieTrending(page);
  }
}
