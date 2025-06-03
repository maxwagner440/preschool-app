import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Express } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('upload-signed-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSignedPdf(@UploadedFile() file: File) {
    console.log('Received PDF:', file.name, file.size);
    // const fileBuffer = await file.arrayBuffer();
    // const s3Response = await this.appService.uploadPdfToS3(file.bu);
    // console.log('Uploaded to S3:', s3Response);
    // Save to S3 and send to Google Drive
  }
}
