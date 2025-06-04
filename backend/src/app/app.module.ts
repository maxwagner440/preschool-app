import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsS3Service } from './aws-s3.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AwsS3Service],
})
export class AppModule {}
