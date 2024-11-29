// jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationLogService } from '../../authentication-log/authentication-log.service'; // Inject log service
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authenticationLogService: AuthenticationLogService) {
    super();
  }

  // Override the handleRequest method to add logging functionality
  handleRequest(err, user, info, context: ExecutionContext): any {
    if (err || !user) {
      // If authentication fails, log the failed attempt
      const request = context.switchToHttp().getRequest();
      this.authenticationLogService.createLog(request.user?.userId, 'Authentication Failed', 'Failure');
      throw err || new Error('Unauthorized');
    }

    // If authentication succeeds, log the success event
    const request = context.switchToHttp().getRequest();
    this.authenticationLogService.createLog(request.user?.userId, 'Authentication Succeeded', 'Success');

    return user; // Return the user object after successful authentication
  }
}
