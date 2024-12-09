import { Controller, Post, Body, Param, Patch, Delete ,UseGuards,Request,BadRequestException,Get,Query} from '@nestjs/common';
import { NotesService } from './note.service';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Note } from 'src/schemas/note.schema';

@Controller('note')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthorizationGuard)
  @Post('createNote')
  @Roles('student','instructor') // Ensure only students can create notes
  async createNote(
    @Body() body: { content: string; courseId: string }, // Accept content and courseId directly in the body
    @Request() req, // Access the request object to get user data
  ): Promise<Note> {
    try {
      // Get the user's email from the token (extracted by the AuthorizationGuard)
      const studentEmail = req.user.email;
  
      // Add the user's email to the note data
      const noteData = { ...body, studentEmail };
  
      // Pass the data to the service for saving
      return await this.notesService.createNote(noteData.content, noteData.courseId, studentEmail);
    } catch (error) {
      // Handle errors (e.g., database constraint violations)
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }

  // Edit an existing note
  // Edit an existing note (by studentEmail and courseId)
  @UseGuards(AuthorizationGuard)
  @Patch('editNote')
  @Roles('student')
  async editNote(
    @Body() body: { content: string; courseId: string },
    @Request() req,
  ): Promise<Note> {
    try {
      const studentEmail = req.user.email;
      return await this.notesService.editNote(body.content, body.courseId, studentEmail);
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }

  // Delete an existing note (by studentEmail and courseId)
  @UseGuards(AuthorizationGuard)
  @Delete('deleteNote')
  @Roles('student')
  async deleteNote(
    @Body() body: { courseId: string }, // Only courseId is required to identify the note
    @Request() req,
  ): Promise<{ message: string }> {
    try {
      const studentEmail = req.user.email;
      await this.notesService.deleteNote(body.courseId, studentEmail);
      return { message: 'Succesfully deleted' };
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }

  @UseGuards(AuthorizationGuard)
  @Get('getNotes')
  @Roles('student')
  async getNotes(
    @Request() req,
  ): Promise<Note[]> {
    try {
      const studentEmail = req.user.email;
      return await this.notesService.getNotes(studentEmail);
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }

}
