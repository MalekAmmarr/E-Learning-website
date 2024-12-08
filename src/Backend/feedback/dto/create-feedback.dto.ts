import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  courseId: string;

  @IsString()
  Student_FeedBack_OnCourse: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
