import { Test } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies with the correct page', async () => {
      const mockData = {
        results: [{ id: 1, title: 'Movie' }],
        page: 1,
        total_pages: 10,
        total_results: 200,
      };
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));
  
      const result = await service.getPopularMovies(3);
  
      expect(httpService.get).toHaveBeenCalledWith('movie/popular', {
        params: { page: 3 },
      });
      expect(result).toEqual({
        results: mockData.results,
        page: mockData.page,
        totalPages: mockData.total_pages,
        totalResults: mockData.total_results,
      });
    });
  });
  describe('getTopRatedMovies', () => {
    it('should pass correct parameters', async () => {
      const mockData = {
        results: [{ id: 2, title: 'Top Rated' }],
        page: 3,
        total_pages: 5,
        total_results: 100,
      };
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));
  
      await service.getTopRatedMovies(3);
  
      expect(httpService.get).toHaveBeenCalledWith('discover/movie', {
        params: {
          page: 3,
          sort_by: 'vote_average.desc',
          without_genres: '99,10755',
          'vote_count.gte': 200,
        },
      });
    });
  });

  describe('searchMovies', () => {
    it('should include query parameters', async () => {
      const mockData = {
        results: [{ id: 3, title: 'Search Result' }],
        page: 2,
        total_pages: 3,
        total_results: 30,
      };
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));
  
      await service.searchMovies('test', 2);
  
      expect(httpService.get).toHaveBeenCalledWith('search/movie', {
        params: {
          page: 2,
          query: 'test',
          include_adult: true,
          language: 'en-US',
        },
      });
    });
  });
  describe('getMovieDetails', () => {
    it('should fetch movie by ID', async () => {
      const mockData = { id: 123, title: 'Test Movie' };
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));
  
      const result = await service.getMovieDetails(123);
  
      expect(httpService.get).toHaveBeenCalledWith('movie/123');
      expect(result).toEqual(mockData);
    });
  });
});