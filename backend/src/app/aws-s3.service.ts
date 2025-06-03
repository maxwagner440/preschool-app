import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadPdfToS3(fileBuffer: Buffer): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${uuidv4()}.pdf`,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    };

    return this.s3.upload(params).promise();
  }
} 