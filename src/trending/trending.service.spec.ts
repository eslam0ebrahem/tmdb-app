import { Test } from '@nestjs/testing';
import { TrendingService } from './trending.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('TrendingService', () => {
  let service: TrendingService;
  let httpService: HttpService;

  const generateMockResponseData = (page: number) => ({
    results: [{ id: page, name: `Trending Item ${page}` }],
    page,
    total_pages: 5,
    total_results: 100,
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TrendingService,
        {
          provide: HttpService,
          useValue: { get: jest.fn(() => of({ data: {} })) },
        },
      ],
    }).compile();

    service = module.get<TrendingService>(TrendingService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getAllTrending', () => {
    it('should fetch trending items with correct parameters', async () => {
      const mockData = generateMockResponseData(2); 
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getAllTrending(2);

      expect(httpService.get).toHaveBeenCalledWith('trending/all/day', {
        params: { page: 2, language: 'en-US' },
      });
      expect(result).toEqual({
        results: mockData.results,
        page: mockData.page,
        totalPages: mockData.total_pages,
        totalResults: mockData.total_results,
      });
    });

    it('should use default page if not provided', async () => {
      const mockData = generateMockResponseData(1); // Use default page
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));

      await service.getAllTrending();
      expect(httpService.get).toHaveBeenCalledWith('trending/all/day', {
        params: { page: 1, language: 'en-US' },
      });
    });
  });

  describe('getMovieTrending', () => {
    it('should fetch trending movies with proper structure', async () => {
      const mockData = generateMockResponseData(3); // Use dynamic page
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));

      const result = await service.getMovieTrending();

      expect(httpService.get).toHaveBeenCalledWith('trending/movie/day', {
        params: { page: 1, language: 'en-US' },
      });
      expect(result).toMatchObject({
        results: expect.any(Array),
        totalPages: mockData.total_pages,
      });
    });

    it('should pass custom page parameter', async () => {
      const mockData = generateMockResponseData(5); // Use custom page
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: mockData }));

      await service.getMovieTrending(5);
      expect(httpService.get).toHaveBeenCalledWith('trending/movie/day', {
        params: { page: 5, language: 'en-US' },
      });
    });
  });

  describe('response transformation', () => {
    it('should correctly transform snake_case to camelCase', async () => {
      const apiResponse = {
        results: [],
        page: 1,
        total_pages: 1,
        total_results: 0,
      };
      (httpService.get as jest.Mock).mockReturnValueOnce(of({ data: apiResponse }));

      const result = await service.getAllTrending();
      
      expect(result).toEqual({
        results: [],
        page: 1,
        totalPages: 1,
        totalResults: 0,
      });
    });
  });
});
