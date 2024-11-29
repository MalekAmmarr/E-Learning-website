import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // GET /users - Get all users
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
