import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticationLog } from 'src/schemas/authentication-log.schema';

@Injectable()
export class AuthenticationLogService {
    constructor(
        @InjectModel(AuthenticationLog.name, 'eLearningDB') private readonly authenticationModel: Model<AuthenticationLog>) {}
    
}
