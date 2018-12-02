import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../config/config.service';

import { loggerProviders } from './logger.providers';
import { Logger } from './logger.service';

// Mocks
jest.mock('../config/config.service');

describe('LoggerService', () => {
  let service: Logger;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...loggerProviders, ConfigService],
    }).compile();
    service = module.get<Logger>(Logger);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
