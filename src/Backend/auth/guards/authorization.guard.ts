import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Extract token part from 'Bearer <token>'
      const bearerToken = token.split(' ')[1];
      if (!bearerToken) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Verify the JWT token and decode it
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach the user information to the request object for use in the route handler
      request.user = decoded;

      // Optionally, you can add role-based access control
      const requiredRole = this.reflector.get<string[]>('roles', context.getHandler());
      if (requiredRole && !requiredRole.includes(decoded.role)) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or token expired');
    }
  }
}
