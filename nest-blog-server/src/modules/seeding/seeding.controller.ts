import { Controller } from '@nestjs/common';
import { SeedingService } from './seeding.service';

@Controller('databases')
export class SeedingController {
  constructor(private readonly seedingService: SeedingService) {}
}
