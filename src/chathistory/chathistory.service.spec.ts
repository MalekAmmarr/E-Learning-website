import { Test, TestingModule } from '@nestjs/testing';
import { ChathistoryService } from './chathistory.service';

describe('ChathistoryService', () => {
  let service: ChathistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChathistoryService],
    }).compile();

    service = module.get<ChathistoryService>(ChathistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
