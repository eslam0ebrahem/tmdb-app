import { Test } from '@nestjs/testing';
import { TrendingController } from './trending.controller';
import { TrendingService } from './trending.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TrendingController', () => {
  let controller: TrendingController;
  let trendingService: TrendingService;

  const generateMockResponseData = (page: number) => ({
    results: [{ id: 1, title: 'Test Item' }],
    page,  
    totalPages: 5,
    totalResults: 100,
  });

  beforeEach(async () => {
    const mockService = {
      getAllTrending: jest.fn().mockImplementation((page: number) => {
        return Promise.resolve(generateMockResponseData(page)); 
      }),
      getMovieTrending: jest.fn().mockImplementation((page: number) => {
        return Promise.resolve(generateMockResponseData(page)); 
      }),
    };

    const module = await Test.createTestingModule({
      controllers: [TrendingController],
      providers: [
        { provide: TrendingService, useValue: mockService },
        {
          provide: CacheInterceptor,
          useValue: {
            intercept: (context: ExecutionContext, next: CallHandler) => {
              return next.handle();
            },
          },
        },
      ],
    }).overrideInterceptor(CacheInterceptor).useValue({ intercept: (ctx, next) => next.handle() }).compile();

    controller = module.get<TrendingController>(TrendingController);
    trendingService = module.get<TrendingService>(TrendingService);
  });

  describe('GET /all', () => {
    it('should call service with default page 1', async () => {
      const result = await controller.getAllTrending();
      expect(trendingService.getAllTrending).toHaveBeenCalledWith(1);
      expect(result).toEqual(generateMockResponseData(1));
    });

    it('should pass custom page parameter to service', async () => {
      const result = await controller.getAllTrending(3);
      expect(trendingService.getAllTrending).toHaveBeenCalledWith(3);
      expect(result).toEqual(generateMockResponseData(3));
    });
  });

  describe('GET /movies', () => {
    it('should use default page 1 when no parameter', async () => {
      const result = await controller.getMovieTrending();
      expect(trendingService.getMovieTrending).toHaveBeenCalledWith(1);
      expect(result).toEqual(generateMockResponseData(1));
    });

    it('should handle custom page numbers correctly', async () => {
      const result = await controller.getMovieTrending(5);

      expect(trendingService.getMovieTrending).toHaveBeenCalledWith(5);

      expect(result.page).toBe(5);

      expect(result).toEqual(expect.objectContaining(generateMockResponseData(5)));
    });
  });

});
