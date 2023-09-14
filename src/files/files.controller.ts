import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
// import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
// import { pipeline } from 'stream';
// import { promisify } from 'util';
import * as multer from 'multer';

interface MulterRequest extends Request {
  file: any;
}

@ApiTags('files')
@Controller('files')
export class FilesController {
  @Post()
  @ApiOperation({ summary: 'Upload file' })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while uploading the file.',
  })
  @ApiResponse({
    status: 201,
    description: 'File has been uploaded',
  })
  async uploadFile(@Req() req: MulterRequest, @Res() res: Response) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, join(__dirname, '..', '..', 'uploads'));
      },
      filename: function (req, file, cb) {
        const uniqueName = randomBytes(16).toString('hex');
        console.log(uniqueName + file.originalname);
        cb(null, uniqueName + file.originalname);
      },
    });
    // здесь после storage можно поставить опцию limits чтобы
    // обозначить ограничения на размер файлов
    const upload = multer({ storage }).single('file');

    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Upload failed', error: err.message });
      }
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file provided' });
      }
      return res.status(201).json({ message: 'File has been uploaded' });
    });
  }
}
