import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { admin, AdminSchema } from 'src/schemas/admin.schema';
import { Instructor, InstructorSchema } from 'src/schemas/instructor.schema';
import { InstructorModule } from '../instructor/instructor.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    MongooseModule.forFeature(
        [
          { name: User.name, schema: UserSchema },
          { name: admin.name, schema: AdminSchema },
          { name: Instructor.name, schema: InstructorSchema },

        ],
        'eLearningDB', // Specify the database connection name
      ),
    forwardRef(() => AdminsModule), // Resolves circular dependency if any
    forwardRef(() => UsersModule),
    forwardRef(() => InstructorModule),    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', // Replace with an environment variable
      signOptions: { expiresIn: '1h' }, // Set token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
