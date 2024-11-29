import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationLogService } from './authentication-log.service';

describe('AuthenticationLogService', () => {
  let service: AuthenticationLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationLogService],
    }).compile();

    service = module.get<AuthenticationLogService>(AuthenticationLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
