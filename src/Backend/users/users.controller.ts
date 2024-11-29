import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../schemas/user.schema';
import { AdminGuard } from './guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
}
