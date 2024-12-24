import './page.css';
export interface ChatHistory {
    Title: string;
    Admin: string;
    CourseTitle: string;
    MembersEmail: string[];
    MembersName: string[];
    ProfilePictureUrl: string;
    timestamp: Date;
    privacy: string;
}
declare const ChatCreate: () => import("react/jsx-runtime").JSX.Element;
export default ChatCreate;
