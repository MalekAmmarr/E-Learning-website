<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# E-Learning Platform with Adaptive Modules and Performance Tracking

# Project Description

# Overview
This project involves developing a feature-rich E-Learning Platform using modern web technologies, including NestJS (Node.js, TypeScript), MongoDB, and Next.js. The platform is designed to provide adaptive learning experiences and personalized performance tracking for three user roles: students, instructors, and administrators. The system emphasizes interactive learning, security, and scalability.

# Features
1. User Management
Secure authentication using JWT with role-based access control for students, instructors, and admins.
User profile management with course tracking and performance monitoring.

2. Course Management
Instructors can create, update, and organize courses with multimedia resources (videos, PDFs).
Version control ensures previous course versions remain accessible.
Search functionality for courses, students, and instructors.

3. Interactive Modules
Adaptive quizzes dynamically adjust difficulty based on student performance.
Real-time feedback provides instant insights into quiz results.

4. Performance Tracking
Student dashboards visualize course completion rates, average scores, and engagement metrics.
Instructor analytics provide insights into student engagement and assessment results.

5. Security and Data Protection
JWT authentication with bcrypt password hashing for secure login.
Role-based access control (RBAC) to protect sensitive APIs.
Automated data backups to prevent information loss.

6. Communication Features
Real-time chat for students and instructors.
Discussion forums for course-specific interactions.
Notifications for new messages, replies, and announcements.

# Additional Features (Team Dependent)
Teams may implement one or more of the following:

# Adaptive Recommendation Engine (AI-powered personalized course suggestions).
Biometric Authentication for enhanced security during exams.
Quick Notes for students to save key points while studying.
Technology Stack
Backend: NestJS (Node.js, TypeScript).
Frontend: Next.js.
Database: MongoDB.
Authentication: JSON Web Tokens (JWT), bcrypt.
Security: Multi-Factor Authentication (MFA).
AI: Python-based recommendation system (Flask/FastAPI).

# Deliverables
A fully functional E-Learning platform deployed to the cloud.
Complete source code hosted on GitHub with proper documentation.
A project presentation showcasing the system's features and implementation.


[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Website preview

![image](https://github.com/user-attachments/assets/c899df21-530f-4d9e-9f0d-b3bb75bfb32d)


![image](https://github.com/user-attachments/assets/3cdcaea7-6b89-4065-b1d6-a1e5a18ed84b)



## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm start: Backend

cd src/frontend
$ npm run dev: FRONTEND

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE). 
