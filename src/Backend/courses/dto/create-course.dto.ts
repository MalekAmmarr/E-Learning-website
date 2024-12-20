export class CreateCourseDto {
  courseId: string;
  title: string;
  instructormail: string;
  instructorName?: string;
  description: string;
  category: string;
  difficultyLevel: string;
  totalClasses: number;
  courseContent: string[];
  notes: string[];
  price: number;  // New field
  image: string;  // New field
}
