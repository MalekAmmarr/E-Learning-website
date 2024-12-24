'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
require("./page.css");
const ChatCreate = () => {
    const [groupDetails, setGroupDetails] = (0, react_1.useState)({
        Title: '',
        Admin: '',
        CourseTitle: '',
        MembersEmail: [],
        MembersName: [],
        ProfilePictureUrl: '',
        privacy: 'public',
        timestamp: new Date(),
    });
    const [Admin, setAdminEmail] = (0, react_1.useState)('');
    const [courseTitle, setCourseTitle] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [createGroupResponse, setCreateGroupResponse] = (0, react_1.useState)(null);
    const [imagePreview, setImagePreview] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [Privacy, setPrivacy] = (0, react_1.useState)('');
    const [InstructorOrStudent, setInstructorOrStudent] = (0, react_1.useState)('student');
    const router = (0, navigation_1.useRouter)();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };
    const handleAddMemberEmail = (e) => {
        if (e.target.name === 'MembersEmail') {
            setGroupDetails((prevDetails) => ({
                ...prevDetails,
                MembersEmail: e.target.value.split(',').map((email) => email.trim()),
            }));
        }
    };
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupDetails.Title ||
            !groupDetails.Admin ||
            !groupDetails.CourseTitle) {
            setError('Please fill in all the required fields.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/chat-history/Create/${InstructorOrStudent}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupDetails),
            });
            if (response.ok) {
                setCreateGroupResponse(await response.json());
                router.push(`/User_Home/chat_Hossam?title=${courseTitle}&privacy=${Privacy}`);
            }
            else {
                setError(`Failed to create chat: Make sure that all ${InstructorOrStudent} are enrolled in ${courseTitle}`);
            }
        }
        catch (err) {
            setError('Error occurred: ' + err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleProfilePictureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setGroupDetails((prevDetails) => ({
                    ...prevDetails,
                    ProfilePictureUrl: base64String,
                }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    (0, react_1.useEffect)(() => {
        const Initialize = async () => {
            const user = sessionStorage.getItem('userData');
            const accessToken = sessionStorage.getItem('authToken');
            if (accessToken) {
                if (user) {
                    const queryParams = new URLSearchParams(window.location.search);
                    const courseTitle = queryParams.get('title');
                    const parsedUser = JSON.parse(user);
                    if (courseTitle) {
                        setAdminEmail(parsedUser.email);
                        setCourseTitle(courseTitle);
                        const queryParams = new URLSearchParams(window.location.search);
                        const privacy = queryParams.get('privacy');
                        if (privacy) {
                            setGroupDetails((prevDetails) => ({
                                ...prevDetails,
                                Admin: parsedUser.email,
                                CourseTitle: courseTitle,
                                privacy,
                            }));
                            setPrivacy(privacy);
                        }
                    }
                    else
                        console.log('no course title available');
                }
            }
        };
        Initialize();
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "form_area", children: [(0, jsx_runtime_1.jsx)("p", { className: "title", children: "Create Group" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleCreateGroup, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form_group", children: [(0, jsx_runtime_1.jsx)("label", { className: "sub_title", htmlFor: "Title", children: "Group Title" }), (0, jsx_runtime_1.jsx)("input", { placeholder: "Enter Group Title", className: "form_style", type: "text", id: "Title", name: "Title", value: groupDetails.Title, onChange: handleInputChange })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form_group", children: [(0, jsx_runtime_1.jsx)("label", { className: "sub_title", htmlFor: "MembersEmail", children: Privacy === 'private'
                                        ? 'Enter the email for private chat'
                                        : 'Members Emails (comma separated)' }), (0, jsx_runtime_1.jsx)("input", { placeholder: Privacy === 'private'
                                        ? 'Enter Member Email'
                                        : 'Enter Member Emails (comma separated)', className: "form_style", type: "text", id: "MembersEmail", name: "MembersEmail", value: Privacy === 'private'
                                        ? groupDetails.MembersEmail[0] || ''
                                        : groupDetails.MembersEmail.join(', '), onChange: handleAddMemberEmail })] }), Privacy === 'private' ? ((0, jsx_runtime_1.jsxs)("div", { className: "form_group", children: [(0, jsx_runtime_1.jsx)("label", { className: "sub_title", children: "Select Your Role" }), (0, jsx_runtime_1.jsxs)("div", { className: "role_selection", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", id: "student", name: "role", value: "Student", onChange: (e) => setInstructorOrStudent(e.target.value) }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "student", children: "Student" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", id: "instructor", name: "role", value: "Instructor", onChange: (e) => setInstructorOrStudent(e.target.value) }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "instructor", children: "Instructor" })] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "form_group", children: [(0, jsx_runtime_1.jsx)("label", { className: "sub_title", htmlFor: "ProfilePictureUrl", children: "Profile Picture" }), (0, jsx_runtime_1.jsxs)("div", { className: "file_input_wrapper", children: [(0, jsx_runtime_1.jsx)("input", { className: "file_input", type: "file", id: "ProfilePictureUrl", name: "ProfilePictureUrl", accept: "image/*", onChange: handleProfilePictureChange }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "ProfilePictureUrl", className: "file_input_button", children: "Choose File" })] }), imagePreview && ((0, jsx_runtime_1.jsx)("div", { className: "image_preview", children: (0, jsx_runtime_1.jsx)("img", { src: imagePreview, alt: "Profile Preview", className: "preview_image" }) }))] })), error && (0, jsx_runtime_1.jsx)("div", { className: "error_message", children: error }), (0, jsx_runtime_1.jsx)("div", { className: "form_group", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "loading-container", children: (0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }) })) : ((0, jsx_runtime_1.jsx)("button", { type: "submit", className: `btn ${loading ? 'loading' : ''}`, disabled: loading, children: "Create Group" })) })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("a", { href: "/User_Home/chat", className: "link", children: "Back To Chat" }) })] }) }));
};
exports.default = ChatCreate;
//# sourceMappingURL=page.js.map