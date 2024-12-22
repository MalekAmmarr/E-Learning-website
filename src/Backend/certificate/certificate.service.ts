import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class CertificateService {

    constructor(
        @InjectModel(User.name, 'eLearningDB')
        private readonly userModel: Model<User>,
      ) {}


    async generateCertificate(data: {
        participant: string;
        institute: string;
        grade: string;
        course: string;
      }): Promise<string> {
        const { participant, institute, grade, course } = data;
    
        // Define the HTML content
        const htmlContent = `
          <html>
          <head>
            <title>Certificate</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Montserrat', sans-serif;
                margin: 0;
                padding: 0;
                background-color: transparent;
              }
              #certificate {
                width: 800px;
                margin: 20px auto;
                background-image: url('https://png.pngtree.com/png-vector/20221206/ourmid/pngtree-golden-blue-certificate-border-folio-f4-size-transparent-png-image_6514169.png');
                background-size: cover;
                padding: 100px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                position: relative;
              }
              #certificate h1, h2, h3 {
                text-align: center;
                color: #b80257;
              }
              #certificate p {
                text-align: center;
                color: #233142;
              }
              #certificate strong {
                color: #f95959;
              }
            </style>
          </head>
          <body>
            <div id="certificate">
              <h1>Certificate of Achievement</h1>
              <p>This is to certify that</p>
              <h2>${participant}</h2>
              <p>has successfully completed the course</p>
              <h3>${course}</h3>
              <p>at</p>
              <h3>${institute}</h3>
              <p>with a grade of <strong>${grade}</strong></p>
              <p>Given this day, ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
          </html>
        `;
    
        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        // Set the HTML content
        await page.setContent(htmlContent);
    
        // Take a screenshot
        const screenshotPath = path.join(__dirname, 'certificate.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
    
        await browser.close();
    
        // Optionally, save the image to a database or cloud storage
        const imageBuffer = fs.readFileSync(screenshotPath);
        // Save `imageBuffer` to your database
    
        return screenshotPath; // Return the file path or URL
      }

      async addCertificate(name: string, courseTitle: string, certificateImageUrl: string) {
        const user = await this.userModel.findOne({ name: name });
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        // Add certificate to the user's certificates array
        user.certificates.push({
          name,
          courseTitle,
          certificateImageUrl, // Assuming this is base64 or a path to a file
        });
    
        await user.save();
        return { message: 'Certificate added successfully' };
    }
    
}
