import { Injectable } from '@nestjs/common';
import { Note } from 'src/schemas/note.schema';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name, 'eLearningDB') private readonly noteModel: Model<Note>,
    @InjectModel(User.name, 'eLearningDB') private userModel: Model<User>,
    @InjectModel(Course.name, 'eLearningDB') private courseModel: Model<Course>
  ) {}


    // Method to create a note for a course
    async createNote(
      studentEmail: string,
      courseTitle: string,
      content: string,
    ): Promise<Note> {
      // Check if the user exists
      const student = await this.userModel.findOne({ email: studentEmail });
      if (!student) {
        throw new Error('Student not found');
      }
  
      // Check if the course exists
      const course = await this.courseModel.findOne({ title: courseTitle });
      if (!course) {
        throw new Error('Course not found');
      }
  
      // Create the note
      const note = new this.noteModel({
        studentEmail,
        courseTitle,
        content,
        timestamp: new Date(),
      });
  
      // Save the note
      await note.save();
  
      // Optionally, add the note reference to the course
      course.notes.push(note.content);
      await course.save();
  
      return note;
    }

}
