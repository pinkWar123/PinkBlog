import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = (folder: string) =>
  diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, generateFileName(file));
    },
  });

const generateFileName = (file: any) => {
  return `${Date.now()}.${extname(file.originalname)}`;
};
