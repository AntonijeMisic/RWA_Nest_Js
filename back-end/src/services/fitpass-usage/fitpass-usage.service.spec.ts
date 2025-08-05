import { Test, TestingModule } from '@nestjs/testing';
import { FitpassUsageService } from './fitpass-usage.service';

describe('FitpassUsageService', () => {
  let service: FitpassUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FitpassUsageService],
    }).compile();

    service = module.get<FitpassUsageService>(FitpassUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
