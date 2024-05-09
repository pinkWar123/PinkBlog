// import { Module } from '@nestjs/common';

// import { MulterModule } from '@nestjs/platform-express';
// import { MulterConfigService } from './multer.config';
// import { UploadController } from './upload.controller';
// import { UploadFileServiceAbstract } from './upload-file.abstract.service';
// import { UploadFileServiceS3 } from './upload-file.service';

// @Module({
//   controllers: [UploadController],
//   providers: [
//     {
//       provide: UploadFileServiceAbstract,
//       useClass: UploadFileServiceS3,
//     },
//   ],
// })
// export class UploadModule {}

import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload-file.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  // imports: [MulterModule.registerAsync({ useClass: MulterConfigService })],
})
export class UploadModule {}
