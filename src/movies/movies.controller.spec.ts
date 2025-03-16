import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { CacheInterceptor } from '@nestjs/cache-manager';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    getPopularMovies: jest.fn(),
    getTopRatedMovies: jest.fn(),
    getUpcomingMovies: jest.fn(),
    searchMovies: jest.fn(),
    getMovieDetails: jest.fn(),
  };

  const mockMovieList = {
    results: [{ id: 1, title: 'Test Movie' }],
    page: 1,
    totalPages: 10,
    totalResults: 100,
  };

  const mockMovieDetails = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test Overview',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService }
      ],
    }).overrideInterceptor(CacheInterceptor).useValue({ intercept: (ctx, next) => next.handle() }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  describe('GET /movies/popular', () => {
    it('should return popular movies with default page', async () => {
      mockMoviesService.getPopularMovies.mockResolvedValue(mockMovieList);
      const result = await controller.getPopularMovies();
      expect(result).toEqual(mockMovieList);
      expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1);
    });

    it('should pass page parameter to service', async () => {
      const page = 3;
      await controller.getPopularMovies(page);
      expect(moviesService.getPopularMovies).toHaveBeenCalledWith(page);
    });
  });

  describe('GET /movies/top-rated', () => {
    it('should return top-rated movies', async () => {
      mockMoviesService.getTopRatedMovies.mockResolvedValue(mockMovieList);
      const result = await controller.getTopRatedMovies();
      expect(result).toEqual(mockMovieList);
    });
  });


  describe('GET /movies/search', () => {
    it('should search movies with query', async () => {
      mockMoviesService.searchMovies.mockResolvedValue(mockMovieList);
      const result = await controller.searchMovies('test', 1);
      expect(result).toEqual(mockMovieList);
    });
  });

  describe('GET /movies/:movieId', () => {
    it('should return movie details', async () => {
      mockMoviesService.getMovieDetails.mockResolvedValue(mockMovieDetails);
      const result = await controller.getMovieDetails(1);
      expect(result).toEqual(mockMovieDetails);
    });
  });
});