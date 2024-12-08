import { Body, Controller, Post, BadRequestException, UseGuards, Get, Delete, Request } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { FeedbackSchema, Feedback } from 'src/schemas/feedback.schema';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @UseGuards(AuthorizationGuard)
    @Post('by-email')
    @Roles('admin', 'instructor')
    async getFeedbacksByEmail(@Body() body: { studentemail: string }): Promise<Feedback[] | { message: string }> {
        const { studentemail } = body;
        if (!studentemail) {
            return { message: 'Student email is required' };
        }
        try {
            const feedbacks = await this.feedbackService.findByEmail(studentemail);
            if (feedbacks.length === 0) {
                console.log('No feedbacks by this user');
                return { message: 'No feedbacks found for this user' };
            }
            return feedbacks;
        } catch (error) {

            return { message: `Error: ${error.message}` };
        }
    }



    @UseGuards(AuthorizationGuard)
    @Get('allfeedbacks')
    @Roles('admin', 'instructor')
    async getAllFeedbacks(): Promise<Feedback[] | { message: string }> {
        try {
            const feedbacks = await this.feedbackService.findAll();
            if (feedbacks.length === 0) {
                console.log('No feedbacks by ');
                return { message: 'No feedbacks found' };
            }
            return feedbacks
        } catch (error) {
            return { message: `Error: ${error.message}` };
        }

    }

    @UseGuards(AuthorizationGuard)
    @Delete('delete-allfeedbacks')
    @Roles('admin', 'instructor')
    async deleteAllFeedbacks(): Promise<{ message: string }> {
        return await this.feedbackService.deleteAllFeedbacks(); // Call the service function
    }

    @UseGuards(AuthorizationGuard)
    @Delete('delete-feedback-by-email')
    @Roles('admin', 'instructor')
    async deleteFeedbacksByEmail(@Body() body: { studentemail: string }): Promise<{ message: string }> {
        const { studentemail } = body;

        if (!studentemail) {
            return { message: 'Student email is required' }; // Validate email input
        }

        return await this.feedbackService.deleteFeedbacksByEmail(studentemail); // Call the service function
    }

    @UseGuards(AuthorizationGuard)
    @Post('createfeedback')
    @Roles('student')
    async createFeedback(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @Request() req, // Access the request object to get user data
    ): Promise<Feedback> {
        const studentemail = req.user.email;

        // Add the email to the feedback data
        const feedbackData = { ...createFeedbackDto, studentemail };

        // Pass the modified data to the service
        return await this.feedbackService.create(feedbackData);
    } catch(error) {
        // Handle unique constraint or validation errors
        const errorMessage = error.message || 'An unexpected error occurred';

        // Throw a BadRequestException with the error message
        throw new BadRequestException(errorMessage);
    }

}

