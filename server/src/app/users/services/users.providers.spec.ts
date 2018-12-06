import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { usersProviders } from './users.providers';

describe('Users', () => {
  let provider: Provider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...usersProviders],
    }).compile();
    provider = module.get<Provider>('UserModelToken');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
