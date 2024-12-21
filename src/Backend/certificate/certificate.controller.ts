import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CertificateService } from './certificate.service';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post('generate')
  async generateCertificate(@Body() body: any) {
    const { participant, institute, grade, course } = body;
    const filePath = await this.certificateService.generateCertificate({
      participant,
      institute,
      grade,
      course,
    });

    return { filePath };
  }

  @Post()
async addCertificate(
  @Body('name') name: string,
  @Body('courseTitle') courseTitle: string,
  @Body('certificateImage') certificateImage: string,
) {
  if (!name || !courseTitle || !certificateImage) {
    throw new BadRequestException('Missing required fields');
  }

  // Save certificate
  return this.certificateService.addCertificate(name, courseTitle, certificateImage);
}

}
