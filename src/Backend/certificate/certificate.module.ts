import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from 'src/schemas/certificate.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Certificate.name, schema: CertificateSchema },
        { name: User.name, schema: UserSchema }
      ],
      'eLearningDB',
    ),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
