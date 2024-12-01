import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteService } from './note.service';
import { Types } from 'mongoose';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

 /* @Post(':courseId')
  async createNote(
    @Param('courseId') courseId: string,
    @Body() createNoteDto: CreateNoteDto
  ) {
    // Step 1: Ensure the user is enrolled in the course
    const studentId = createNoteDto.studentId;  // Access the studentId directly from DTO
    
    // Ensure studentId is a valid ObjectId (this is critical if the ID is passed as a string)
    if (!Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID');
    }

    const student = await this.noteService.getStudentById(studentId);
    if (!student.appliedCourses.includes(courseId)) {
      throw new Error('Student is not enrolled in this course');
    }

    // Step 2: Create the note for the course
    return await this.noteService.createNote({
      ...createNoteDto,
      courseId: courseId,  // Attach the course ID
    });
  }*/
}
