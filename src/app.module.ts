import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesController } from './files/files.controller';

@Module({
  imports: [],
  controllers: [AppController, FilesController],
  providers: [AppService],
})
export class AppModule {}
