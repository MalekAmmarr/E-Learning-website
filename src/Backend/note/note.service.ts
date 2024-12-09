import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema , User} from 'src/schemas/user.schema';
import { Note } from 'src/schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>,
    @InjectModel(Note.name, 'eLearningDB') private readonly noteModel: Model<Note>
    
  ) {}

  async createNote(content: string, courseId: string, studentEmail: string): Promise<Note> {
    // Fetch the user by ID to get the email
    const user = await this.userModel.findOne({email:studentEmail});
  
    if (!user) {
      throw new Error('User not found');
    }
    // Create a new note
    const newNote = new this.noteModel({
      content,
      courseId,
      studentEmail
       // Optionally, add the user's email to the note if needed
    });
  
    // Save the note
    const savedNote = await newNote.save();
  
    return savedNote;
  }

  async editNote(content: string, courseId: string, studentEmail: string): Promise<Note> {
    const updatedNote = await this.noteModel.findOneAndUpdate(
      { studentEmail, courseId },  // Find the note by studentEmail and courseId
      { content },                  // Update the content
      { new: true }                  // Return the updated note after the update
    );

    if (!updatedNote) {
      throw new Error('Note not found');
    }

    return updatedNote;
  }

  // Delete a note by studentEmail and courseId
  async deleteNote(courseId: string, studentEmail: string): Promise<void> {
    const deletedNote = await this.noteModel.findOneAndDelete({ studentEmail, courseId });

    if (!deletedNote) {
      throw new Error('Note not found');
    }
  }

  async getNotes(studentEmail: string, courseId?: string): Promise<Note[]> {
    // Retrieve notes matching the filter
    const notes = await this.noteModel.find({studentEmail});
    return notes;
  }
  
}

