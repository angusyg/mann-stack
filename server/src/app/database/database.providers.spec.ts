import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';

import { ConfigService } from '../config/config.service';

import { databaseProviders } from './database.providers';

// Mocks
jest.mock('../config/config.service');
jest.mock('mongoose', () => {
  return { connect: jest.fn().mockResolvedValue({}) };
});

describe('DbConnection', () => {
  let provider: Provider;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...databaseProviders, ConfigService],
    }).compile();
    provider = module.get<Provider>('DbConnection');
  });

  test('should be defined', () => {
    expect(provider).toBeDefined();
    expect(provider).toEqual({});
  });

  test('should connect to DB', () => {
    expect(mongoose.connect.mock.calls[0][0]).toEqual(`mongodb://undefined/undefined`);
  });
});
