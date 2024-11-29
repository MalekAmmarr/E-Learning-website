import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from '../schemas/certificate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Certificate.name, schema: CertificateSchema }], 'eLearningDB'),
  ],
  controllers: [CertificateController],
  providers: [CertificateService]
})
export class CertificateModule {}
