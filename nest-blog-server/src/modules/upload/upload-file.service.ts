// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { UploadFileServiceAbstract } from './upload-file.abstract.service';

// @Injectable()
// export class UploadFileServiceS3 implements UploadFileServiceAbstract {
//   private s3_client: S3Client;
//   constructor(private readonly config_service: ConfigService) {
//     this.s3_client = new S3Client({
//       region: config_service.get('AWS_S3_REGION'),
//       credentials: {
//         accessKeyId: config_service.get('AWS_S3_ACCESS_KEY_ID'),
//         secretAccessKey: config_service.get('AWS_S3_SECRET_ACCESS_KEY'),
//       },
//     });
//   }
//   async uploadFileToPublicBucket(
//     path: string,
//     { file, file_name }: { file: Express.Multer.File; file_name: string },
//   ) {
//     const bucket_name = this.config_service.get('AWS_S3_PUBLIC_BUCKET');
//     const key = `${path}/${Date.now().toString()}-${file_name}`;
//     await this.s3_client.send(
//       new PutObjectCommand({
//         Bucket: bucket_name,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read',
//         ContentLength: file.size, // calculate length of buffer
//       }),
//     );

//     return { url: `https://${bucket_name}.s3.amazonaws.com/${key}`, key: key };
//   }
// }

import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { DeleteDto } from './dto/delete.dto';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.get<string>('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(req: any, fileName: string, file: Express.Multer.File) {
    const folder = req?.headers?.folder_type ?? 'default';
    const extName = path.extname(file.originalname);
    //get image's name (without extension)
    const baseName = path.basename(file.originalname, extName);
    const finalName = `${folder}/${baseName}-${Date.now()}${extName}`;
    const bucketName = this.configService.getOrThrow('AWS_S3_PUBLIC_BUCKET');
    const res = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: finalName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentDisposition: 'inline',
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );
    return {
      fileName: `https://${bucketName}.s3.amazonaws.com/${finalName}`,
      key: finalName,
    };
  }

  async remove(deleteDto: DeleteDto) {
    const folderName = deleteDto.folder ? deleteDto.folder : 'default';
    const res = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_S3_PUBLIC_BUCKET'),
        Key: folderName + '/' + deleteDto.key,
      }),
    );
  }
}
