import './page.css';
export interface User {
    email: string;
    name: string;
    age: string;
    passwordHash: string;
    profilePictureUrl?: string;
    appliedCourses: string[];
    acceptedCourses: string[];
    score: number;
}
declare const Apply_Students: React.FC;
export default Apply_Students;
