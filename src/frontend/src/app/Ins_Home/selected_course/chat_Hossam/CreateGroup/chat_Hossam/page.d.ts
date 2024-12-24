import './page.css';
export interface ChatHistory {
    Title: string;
    Admin: string;
    CourseTitle: string;
    MembersEmail: string[];
    MembersName: string[];
    ProfilePictureUrl: string;
    timestamp: Date;
}
export interface Message {
    senderEmail: string;
    senderName?: string;
    message: string;
    ProfilePictureUrl?: string;
    timestamp: Date;
}
declare const chat: () => import("react/jsx-runtime").JSX.Element;
export default chat;
