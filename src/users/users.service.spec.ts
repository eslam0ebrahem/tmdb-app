import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, of } from 'rxjs';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfig = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'TMDB_ACCESS_TOKEN':
          return 'test_token';
        case 'TMDB_ACCOUNT_ID':
          return 'account123';
        default:
          return null;
      }
    }),
  };

  const mockHttp = {
    post: jest.fn().mockImplementation(() => of({ data: {} })),
    get: jest.fn().mockImplementation(() => of({ data: {} })),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: ConfigService, useValue: mockConfig },
        { provide: HttpService, useValue: mockHttp },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('getFavoriteMovies', () => {
    it('should fetch with correct pagination', async () => {
      const mockResponse = { results: [{ id: 1, title: 'Movie' }], page: 2 };
      mockHttp.get.mockReturnValueOnce(of({ data: mockResponse }));

      const result = await service.getFavoriteMovies(2);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAccountDetails', () => {
    it('should fetch account information', async () => {
      const mockAccount = { id: 'account123', name: 'Test User' };
      mockHttp.get.mockReturnValueOnce(of({ data: mockAccount }));

      const result = await service.getAccountDetails();

      expect(result).toEqual(mockAccount);
    });
  });

  describe('Configuration Validation', () => {
    it('should throw error if auth token missing', async () => {
      mockConfig.get.mockImplementation((key) => {
        if (key === 'TMDB_ACCESS_TOKEN') return null;
        if (key === 'TMDB_ACCOUNT_ID') return 'account123';
        return null;
      });
  
      await expect(service.getAccountDetails()).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});