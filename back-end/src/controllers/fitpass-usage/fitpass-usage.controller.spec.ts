import { Test, TestingModule } from '@nestjs/testing';
import { FitpassUsageController } from './fitpass-usage.controller';

describe('FitpassUsageController', () => {
  let controller: FitpassUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitpassUsageController],
    }).compile();

    controller = module.get<FitpassUsageController>(FitpassUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
