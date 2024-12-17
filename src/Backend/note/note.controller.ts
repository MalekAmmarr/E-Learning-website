import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  Get,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './note.service';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Note } from 'src/schemas/note.schema';
import { Response } from 'express';

@Controller('note')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthorizationGuard)
  @Post('createNote')
  @Roles('student', 'instructor') // Ensure only students can create notes
  async createNote(
    @Body() { studentEmail, Title }: { studentEmail: string; Title: string },
  ): Promise<Note> {
    try {
      // Pass the data to the service for saving
      return await this.notesService.createNote(studentEmail, Title);
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
    @Body()
    {
      studentEmail,
      newTitle,
      newEmail,
    }: {
      studentEmail: string;
      newTitle: string;
      newEmail: string;
    },
  ): Promise<Note> {
    try {
      return await this.notesService.editNote(studentEmail, newTitle, newEmail);
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }
  @UseGuards(AuthorizationGuard)
  @Patch('/editSpecificNote')
  @Roles('student')
  async editNodeString(
    @Body()
    {
      studentEmail,
      index,
      newString,
    }: {
      studentEmail: string;
      index: number;
      newString: string;
    },
  ): Promise<Note> {
    try {
      return await this.notesService.editNodeString(
        studentEmail,
        index,
        newString,
      );
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }

  @UseGuards(AuthorizationGuard)
  @Delete('deleteNote')
  @Roles('student')
  async deleteNodeString(
    @Body()
    {
      studentEmail,
      index,
      Title,
    }: {
      studentEmail: string;
      index: number;
      Title: String;
    },
  ): Promise<Note> {
    try {
      return await this.notesService.deleteNodeString(
        studentEmail,
        index,
        Title,
      );
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }
  @UseGuards(AuthorizationGuard)
  @Delete('deleteAllNote')
  @Roles('student')
  async deleteNote(
    @Body()
    {
      studentEmail,
      Title,
    }: {
      studentEmail: string;

      Title: String;
    },
  ): Promise<void> {
    try {
      return await this.notesService.deleteAllNote(studentEmail, Title);
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }

  @Post('getNotes')
  async getNotesByStudentEmail(
    @Body() { studentEmail }: { studentEmail: string },
    @Res() res: Response,
  ) {
    try {
      const notes =
        await this.notesService.getNotesByStudentEmail(studentEmail);
      return res.status(HttpStatus.OK).json(notes);
    } catch (error) {
      console.error(error.message);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message || 'Internal server error' });
    }
  }
  @Post('showNotes')
  async getNotesByTitle(
    @Body() { Title }: { Title: string },
    @Res() res: Response,
  ) {
    try {
      const notes = await this.notesService.getNotesByTitle(Title);
      return res.status(HttpStatus.OK).json(notes);
    } catch (error) {
      console.error(error.message);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message || 'Internal server error' });
    }
  }
  @UseGuards(AuthorizationGuard)
  @Post('addNote')
  @Roles('student') // Or any role you want to assign this endpoint to
  async addNote(
    @Body()
    {
      studentEmail,
      Title,
      content,
    }: {
      studentEmail: string;
      Title: string;
      content: string;
    },
  ): Promise<Note> {
    try {
      return await this.notesService.addNoteToDatabase(
        studentEmail,
        Title,
        content,
      );
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      throw new BadRequestException(errorMessage);
    }
  }
}
