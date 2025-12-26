import { Test, TestingModule } from '@nestjs/testing';
import { EpisodiosService } from './episodios.service';

describe('EpisodiosService', () => {
  let service: EpisodiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpisodiosService],
    }).compile();

    service = module.get<EpisodiosService>(EpisodiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
