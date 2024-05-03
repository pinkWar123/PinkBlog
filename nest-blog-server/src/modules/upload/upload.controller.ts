import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { HttpExceptionFilter } from 'src/core/http-exception.filter';
import { Public } from 'src/decorators/public';
import { ResponseMessage } from 'src/decorators/response.message';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Public()
  @Post()
  @ResponseMessage('Upload a single file')
  @UseInterceptors(FileInterceptor('file')) //tên field sử dụng trong form-data
  @UseFilters(new HttpExceptionFilter())
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }
}
