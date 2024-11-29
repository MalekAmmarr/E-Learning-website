import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service'; 
import { JwtPayload } from './jwt-payload.interface';// Define the JWT payload interface
import { AuthenticationLogService } from '../authentication-log.service';// To log auth events
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticationLog } from 'src/schemas/authentication-log.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private authenticationLogService: AuthenticationLogService,  // Inject AuthenticationLogService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',  // Make sure you use a secure secret
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.userId); // Assuming the payload contains userId
    if (!user) {
      // Log the failed authentication attempt
      await this.authenticationLogService.createLog(payload.userId, 'Authentication Failed', 'Failure');
      throw new Error('User not found');
    }

    // Log successful authentication
    await this.authenticationLogService.createLog(payload.userId, 'Authentication Succeeded', 'Success');

    return user;  // Attach the user to the request
  }
}
