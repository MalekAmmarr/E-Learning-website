import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { Backup, BackupSchema } from 'src/schemas/backup.schema';
import { admin, AdminSchema } from 'src/schemas/admin.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Backup.name, schema: BackupSchema },
    ],'dataManagementDB'),
    MongooseModule.forFeature([ { name:admin.name , schema: AdminSchema },
      { name: User.name, schema: UserSchema },], 'eLearningDB'),
  ],

  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
