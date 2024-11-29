import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentSchema } from 'src/schemas/enrollement.schema';

@Injectable()
export class EnrollementService {
  constructor(
    @InjectModel(Enrollment.name, 'eLearningDB')
    private readonly enrollementModel: Model<Enrollment>,
  ) {}
}
