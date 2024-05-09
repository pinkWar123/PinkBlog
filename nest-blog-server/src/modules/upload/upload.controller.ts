// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   UseFilters,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiTags } from '@nestjs/swagger';

// import { HttpExceptionFilter } from 'src/core/http-exception.filter';
// import { Public } from 'src/decorators/public';
// import { ResponseMessage } from 'src/decorators/response.message';

// @ApiTags('upload')
// @Controller('upload')
// export class UploadController {
//   @Public()
//   @Post()
//   @ResponseMessage('Upload a single file')
//   @UseInterceptors(FileInterceptor('file')) //tên field sử dụng trong form-data
//   @UseFilters(new HttpExceptionFilter())
//   uploadFile(@UploadedFile() file: Express.Multer.File) {
//     return {
//       fileName: file.filename,
//     };
//   }
// }

import {
  Body,
  Controller,
  Delete,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload-file.service';
import { Public } from 'src/decorators/public';
import { ResponseMessage } from 'src/decorators/response.message';
import { DeleteDto } from './dto/delete.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('This api returns the url of the uploaded file')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    const folder_type = req?.headers?.folder_type ?? 'default';
    console.log(folder_type);
    return await this.uploadService.upload(
      req,
      folder_type + '/' + file.originalname,
      file,
    );
  }

  @Public()
  @Delete()
  @ResponseMessage('This api returns the result of deleting a file')
  async removeFile(@Body() deleteDto: DeleteDto) {
    return this.uploadService.remove(deleteDto);
  }
}
