import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteService } from './note.service';
import { Types } from 'mongoose';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
 // Endpoint to create a note for a course
 @Post()
 async createNote(@Body() createNoteDto: CreateNoteDto) {
   const { studentEmail, courseTitle, content } = createNoteDto;
   return await this.noteService.createNote(studentEmail, courseTitle, content);
 }
}
