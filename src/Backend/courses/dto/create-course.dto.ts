import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsUrl,
  IsEnum,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  instructormail: string;

  @IsString()
  @IsOptional()
  instructorName?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficultyLevel: string;

  @IsNumber()
  @IsNotEmpty()
  totalClasses: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  courseContent: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notes: string[];

  @IsNumber()
  @IsNotEmpty()
  price: number; // New field

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string; // New field
}
