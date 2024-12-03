import { IsArray, IsString } from 'class-validator';

export class DeleteContentDto {
  @IsArray()
  @IsString({ each: true })  // Ensure each item to delete is a string
  contentToDelete: string[];
}
