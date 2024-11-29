import { Test, TestingModule } from '@nestjs/testing';
import { ChathistoryController } from './chathistory.controller';

describe('ChathistoryController', () => {
  let controller: ChathistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChathistoryController],
    }).compile();

    controller = module.get<ChathistoryController>(ChathistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
