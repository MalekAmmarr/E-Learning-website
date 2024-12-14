'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
require("./page.css");
const Apply_Students = () => {
    const [students, setStudents] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:3000/instructor/applied-users/omar.hossam3@gmail.com');
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();
                setStudents(data);
                setLoading(false);
            }
            catch (err) {
                setError('Failed to fetch students');
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);
    const handleAcceptOrReject = async (email, courseName, action) => {
        try {
            const response = await fetch('http://localhost:3000/instructor/accept-reject-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    courseName,
                    action,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to process request');
            }
            const result = await response.json();
            alert(result.message);
            setStudents((prevStudents) => prevStudents.map((student) => {
                if (student.email === email) {
                    return {
                        ...student,
                        appliedCourses: student.appliedCourses.filter((course) => course !== courseName),
                        acceptedCourses: action === 'accept'
                            ? [...student.acceptedCourses, courseName]
                            : student.acceptedCourses,
                    };
                }
                return student;
            }));
        }
        catch (error) {
            alert('Error processing the request');
            console.error(error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "students-container", children: [(0, jsx_runtime_1.jsx)("h1", { className: "title", children: "Applied Students" }), students.map((student) => ((0, jsx_runtime_1.jsxs)("div", { className: "student-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "student-header", children: [student.profilePictureUrl && ((0, jsx_runtime_1.jsx)("img", { className: "profile-img", src: student.profilePictureUrl, alt: "Profile" })), (0, jsx_runtime_1.jsx)("h3", { className: "student-name", children: student.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "student-info", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Age:" }), " ", student.age] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Score:" }), " ", student.score] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " ", student.email] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Applied Courses:" }), ' ', student.appliedCourses.join(', ')] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Accepted Courses:" }), ' ', student.acceptedCourses.join(', ')] })] }), (0, jsx_runtime_1.jsx)("div", { className: "action-buttons", children: student.appliedCourses.map((course) => ((0, jsx_runtime_1.jsxs)("div", { className: "course-actions", children: [(0, jsx_runtime_1.jsx)("div", { className: "student-info", children: (0, jsx_runtime_1.jsx)("strong", { children: course }) }), (0, jsx_runtime_1.jsx)("button", { className: "accept-btn", onClick: () => handleAcceptOrReject(student.email, course, 'accept'), children: "Accept" }), (0, jsx_runtime_1.jsx)("button", { className: "reject-btn", onClick: () => handleAcceptOrReject(student.email, course, 'reject'), children: "Reject" })] }, course))) })] }, student.email)))] }));
};
exports.default = Apply_Students;
//# sourceMappingURL=page.js.map