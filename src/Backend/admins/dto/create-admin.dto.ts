import {
    IsString,
    IsEmail,
    IsOptional,
    IsEnum,
    IsArray,
    IsNumber,
    IsPositive,
  } from 'class-validator';

export class CreateAdminDto {

    @IsString()
    name: string;
  
    @IsString()
    age: number; // Age is required and should be a string (or number if preferred)
  
  
  
    @IsEmail()
    email: string;
  
    @IsString()
    passwordHash: string;

    @IsOptional() // Profile picture URL is optional
    @IsString()
    profilePictureUrl?: string;


}
