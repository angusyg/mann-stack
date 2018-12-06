import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  describe('Configuration OK', () => {
    let service: ConfigService;

    beforeAll(async () => {
      process.env.NODE_ENV = 'test';
      const module: TestingModule = await Test.createTestingModule({ providers: [ConfigService] }).compile();
      service = module.get<ConfigService>(ConfigService);
    });

    test('should be defined', () => {
      expect(service).toBeDefined();
    });

    test('should have loaded values', () => {
      expect(service.get('NODE_ENV')).toEqual('test');
      expect(service.get('PORT')).toEqual(5000);
    });
  });

  describe('Configuration KO', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'test-ko';
    });

    test('should throw an error on configuration validation', async () => {
      try {
        // tslint:disable-next-line:no-unused-expression
        new ConfigService();
        fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).toEqual('Config validation error: child "PORT" fails because ["PORT" must be a number]');
      }
    });
  });
});
