import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthenticationLogService } from 'src/authentication-log/authentication-log.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private authenticationLogService: AuthenticationLogService,  // Inject the service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user is attached to the request by JWT or session

    // Log failed attempts if the user is not an admin
    if (user.role !== 'admin') {
      await this.authenticationLogService.createLog(user.userId, 'Unauthorized Access', 'Failure');
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    // Log successful admin access
    await this.authenticationLogService.createLog(user.userId, 'Admin Access', 'Success');
    
    return true;
  }
}
