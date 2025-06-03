import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';

@Injectable()
export class AppService {
  constructor(private readonly s3Service: AwsS3Service) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async uploadPdfToS3(fileBuffer: Buffer): Promise<AWS.S3.ManagedUpload.SendData> {
    // const s3Service = new AwsS3Service();
    return this.s3Service.uploadPdfToS3(fileBuffer);
  }
}
