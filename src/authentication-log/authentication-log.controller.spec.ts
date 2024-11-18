import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationLogController } from './authentication-log.controller';

describe('AuthenticationLogController', () => {
  let controller: AuthenticationLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationLogController],
    }).compile();

    controller = module.get<AuthenticationLogController>(AuthenticationLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
