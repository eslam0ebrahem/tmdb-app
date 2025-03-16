import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, CallHandler } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockService = {
    getFavoriteMovies: jest.fn().mockResolvedValue([]),
    getFavoriteTvShows: jest.fn().mockResolvedValue([]),
    getWatchlistMovies: jest.fn().mockResolvedValue([]),
    getWatchlistTvShows: jest.fn().mockResolvedValue([]),
    getAccountDetails: jest.fn().mockResolvedValue({ id: 'user123' }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockService },
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

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });  

  describe('GET /user/favorites/movies', () => {
    it('should use default page 1', async () => {
      await controller.getFavoriteMovies();
      expect(usersService.getFavoriteMovies).toHaveBeenCalledWith(1);
    });

    it('should pass custom page parameter', async () => {
      await controller.getFavoriteMovies(3);
      expect(usersService.getFavoriteMovies).toHaveBeenCalledWith(3);
    });
  });

  describe('GET /user/favorites/tv', () => {
    it('should call getFavoriteTvShows service method', async () => {
      await controller.getFavoriteTvShows(2);
      expect(usersService.getFavoriteTvShows).toHaveBeenCalledWith(2);
    });
  });

  describe('GET /user/watchlist/movies', () => {
    it('should handle page parameter correctly', async () => {
      await controller.getWatchlistMovies(5);
      expect(usersService.getWatchlistMovies).toHaveBeenCalledWith(5);
    });
  });

  describe('GET /user/watchlist/tv', () => {
    it('should delegate to getWatchlistTvShows', async () => {
      await controller.getWatchlistTvShows();
      expect(usersService.getWatchlistTvShows).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /user/account', () => {
    it('should return account details', async () => {
      const result = await controller.getAccountDetails();
      expect(usersService.getAccountDetails).toHaveBeenCalled();
      expect(result).toEqual({ id: 'user123' });
    });
  });
});