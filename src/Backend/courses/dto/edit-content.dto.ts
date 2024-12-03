import { IsArray, IsString } from 'class-validator';

export class EditContentDto {
  @IsArray()
  @IsString({ each: true })  // Ensure each item in the array is a string
  newContent: string[];
}
