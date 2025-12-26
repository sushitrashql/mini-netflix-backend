import { Test, TestingModule } from '@nestjs/testing';
import { EpisodiosController } from './episodios.controller';

describe('EpisodiosController', () => {
  let controller: EpisodiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodiosController],
    }).compile();

    controller = module.get<EpisodiosController>(EpisodiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
