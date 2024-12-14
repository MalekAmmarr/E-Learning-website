import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { AuthenticationLogService } from 'src/backend/authentication-log/authentication-log.service';
export declare class UsersService {
    private readonly userModel;
    private readonly authenticationLogService;
    constructor(userModel: Model<User>, authenticationLogService: AuthenticationLogService);
}
