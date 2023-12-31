import { Controller, Post, Req, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { join } from 'path';
import { randomBytes } from 'crypto';
import * as multer from 'multer';

interface MulterRequest extends Request {
  file: any;
}

@ApiTags('files')
@Controller('files')
export class FilesController {
  @Post()
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File has been uploaded',
  })
  @ApiResponse({
    status: 400,
    description: 'No file provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Upload failed',
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
    // без него - ограничения снимаются
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
