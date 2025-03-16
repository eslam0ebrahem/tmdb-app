import { Test, TestingModule } from '@nestjs/testing';
import { TrendingService } from './trending.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { of } from 'rxjs';

describe('TrendingService', () => {
  let service: TrendingService;
  let httpService: HttpService;
  let cacheManager: any;

  const mockData = {
    results: [{ id: 1, title: 'Trending Item' }],
    page: 1,
    totalPages: 10,
    totalResults: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrendingService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({ data: mockData })),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<TrendingService>(TrendingService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTrending', () => {
    it('should fetch all trending content', async () => {
      const result = await service.getAllTrending();
      expect(result).toEqual(mockData);
      expect(httpService.get).toHaveBeenCalledWith(
        'trending/all/day',
        expect.objectContaining({
          params: { language: 'en-US', page: 1 },
        })
      );
    });
  });

  describe('getMovieTrending', () => {
    it('should fetch trending movies', async () => {
      const page = 2;
      await service.getMovieTrending(page);
      expect(httpService.get).toHaveBeenCalledWith(
        'trending/movie/day',
        expect.objectContaining({
          params: { language: 'en-US', page },
        })
      );
    });
  });
});