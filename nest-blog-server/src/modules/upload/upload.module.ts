import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  imports: [MulterModule.registerAsync({ useClass: MulterConfigService })],
})
export class UploadModule {}
