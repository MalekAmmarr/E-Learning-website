import { Module } from '@nestjs/common';
import { NotesController } from './note.controller';
import { NotesService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from 'src/schemas/note.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from '../users/users.module'; // Only import UsersModule if needed by other parts

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Note.name, schema: NoteSchema }, // Inject Note model
        { name: User.name, schema: UserSchema }, // Inject User model to fetch user details
      ],
      'eLearningDB' // Specify the database connection for these models
    ),
    UsersModule, // Import UsersModule only if the service needs to interact with User model
  ],
  controllers: [NotesController], // Register NotesController for routing
  providers: [NotesService], // Provide NotesService to handle logic
  exports: [NotesService], // Export NotesService in case it's needed by other modules
})
export class NoteModule {}
