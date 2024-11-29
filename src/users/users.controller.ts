import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../schemas/user.schema';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from 'src/authentication-log/Middleware/jwt-auth.guard';



@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

    // Create a new user (only accessible by admins)
   @UseGuards(AdminGuard, JwtAuthGuard)
   @Post()
   async create(@Body() createUserDto: CreateUserDto): Promise<User> {
     return this.userService.create(createUserDto);
   }
 
   // Get all users (only accessible by admins)
   @UseGuards(AdminGuard, JwtAuthGuard)
   @Get()
   async findAll(): Promise<User[]> {
     return this.userService.findAll();
   }
 
   
  // Get user by ID (only accessible by admins)
   @UseGuards(AdminGuard, JwtAuthGuard)
   @Get(':id')
   async findById(@Param('id') userId: string): Promise<User> {
     return this.userService.findById(userId);
   }
 // Update user details (only accessible by admins)
   @UseGuards(AdminGuard, JwtAuthGuard)
   @Put(':id')
   async update(
     @Param('id') userId: string,
     @Body() updateUserDto: UpdateUserDto,
   ): Promise<User> {
     return this.userService.update(userId, updateUserDto);
   }
 
   // Delete a user (only accessible by admins)
   @UseGuards(AdminGuard, JwtAuthGuard)
   @Delete(':id')
   async delete(@Param('id') userId: string): Promise<void> {
     return this.userService.delete(userId);
   }
 
   // Assign a role to a user (only accessible by admins)
   @UseGuards(AdminGuard, JwtAuthGuard)
   @Put(':id/role')
   async assignRole(
     @Param('id') userId: string,
     @Body('role') role: string,
   ): Promise<User> {
     return this.userService.assignRole(userId, role);
   }
  }
