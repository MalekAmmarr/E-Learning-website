import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSchema, User } from 'src/schemas/user.schema';
import { Note } from 'src/schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(User.name, 'eLearningDB')
    private readonly userModel: Model<User>,
    @InjectModel(Note.name, 'eLearningDB')
    private readonly noteModel: Model<Note>,
  ) {}

  async createNote(studentEmail: string, Title: string): Promise<Note> {
    // Check if a note with the same email already exists
    const existingNote = await this.noteModel.findOne({ Title });

    if (existingNote) {
      throw new BadRequestException('A note with this Title already exists.');
    }

    // Create a new note if the email is unique
    const newNote = new this.noteModel({
      studentEmail,
      Title,
    });

    // Save the note
    const savedNote = await newNote.save();

    return savedNote;
  }
  async editNote(
    studentEmail: string,
    newTitle: string,
    newEmail: string,
  ): Promise<Note> {
    // Find the note by studentEmail
    const note = await this.noteModel.findOne({ studentEmail });

    if (!note) {
      throw new BadRequestException('Note not found.');
    }

    // Update the title and email
    note.Title = newTitle;
    note.studentEmail = newEmail;

    // Save the updated note
    const updatedNote = await note.save();

    return updatedNote;
  }
  async editNodeString(
    studentEmail: string,
    index: number,
    newString: string,
  ): Promise<Note> {
    // Find the note by studentEmail
    const note = await this.noteModel.findOne({ studentEmail });

    if (!note) {
      throw new BadRequestException('Note not found.');
    }

    // Check if index is valid
    if (index < 0 || index >= note.notes.length) {
      throw new BadRequestException('Invalid index.');
    }

    // Edit the string at the given index in the node[] array
    note.notes[index] = newString;

    // Save the updated note
    const updatedNote = await note.save();

    return updatedNote;
  }
  async deleteNodeString(
    studentEmail: string,
    index: number,
    Title: String,
  ): Promise<Note> {
    // Find the note by studentEmail
    const note = await this.noteModel.findOne({ Title });

    if (!note) {
      throw new BadRequestException('Note not found.');
    }

    // Check if index is valid
    if (index < 0 || index >= note.notes.length) {
      throw new BadRequestException('Invalid index.');
    }

    // Remove the string at the given index in the node[] array
    note.notes.splice(index, 1);

    // Save the updated note
    const updatedNote = await note.save();

    return updatedNote;
  }
  async deleteAllNote(
    studentEmail: string,

    Title: String,
  ): Promise<void> {
    const result = await this.noteModel.deleteOne({ Title });

    if (result.deletedCount === 0) {
      throw new BadRequestException('Note not found.');
    }
  }
  async getNotes(studentEmail: string, courseId?: string): Promise<Note[]> {
    // Retrieve notes matching the filter
    const notes = await this.noteModel.find({ studentEmail });
    return notes;
  }
  // Fetch all notes for a specific studentEmail
  async getNotesByStudentEmail(studentEmail: string): Promise<Note[]> {
    if (!studentEmail) {
      throw new NotFoundException('Student email is required');
    }

    const notes = await this.noteModel.find({ studentEmail }).exec();
    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes found for email: ${studentEmail}`);
    }

    return notes;
  }
  async getNotesByTitle(Title: string): Promise<Note[]> {
    if (!Title) {
      throw new NotFoundException('Title is required');
    }

    const notes = await this.noteModel.find({ Title }).exec();
    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes found for Title: ${Title}`);
    }

    return notes;
  }
  // Service method to add a note
  async addNoteToDatabase(
    studentEmail: string,
    Title: string,
    content: string,
  ): Promise<Note> {
    try {
      // Find the note by the provided title
      const note = await this.noteModel.findOne({ Title });

      // Check if note exists
      if (!note) {
        throw new Error(`Note with title "${Title}" not found.`);
      }

      // Append the new content to the notes array
      note.notes.push(content);

      // Save the updated note to the database
      await note.save();

      // Return the updated note
      return note;
    } catch (error) {
      throw new Error('Error saving note: ' + error.message);
    }
  }
}
