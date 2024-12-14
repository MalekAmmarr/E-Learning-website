'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
require("./page.css");
const RegisterPage = () => {
    const [name, setName] = (0, react_1.useState)('');
    const [age, setAge] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [selectedCourses, setSelectedCourses] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    const handleCourseChange = (event) => {
        const value = event.target.value;
        setSelectedCourses((prevSelectedCourses) => event.target.checked
            ? [...prevSelectedCourses, value]
            : prevSelectedCourses.filter((course) => course !== value));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !age || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    age,
                    email,
                    passwordHash: password,
                    appliedCourses: selectedCourses,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to register');
            }
            setError(null);
            router.push('/login');
        }
        catch (err) {
            setError(err.message || 'An error occurred');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("p", { className: "title", children: "Register" }), (0, jsx_runtime_1.jsx)("p", { className: "message", children: "Signup now and get full access to our app." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { required: true, type: "text", className: "input", value: name, onChange: (e) => setName(e.target.value) }), (0, jsx_runtime_1.jsx)("span", { children: "Name" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { required: true, type: "number", className: "input", value: age, onChange: (e) => setAge(e.target.value) }), (0, jsx_runtime_1.jsx)("span", { children: "Age" })] })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { required: true, type: "email", className: "input", value: email, onChange: (e) => setEmail(e.target.value) }), (0, jsx_runtime_1.jsx)("span", { children: "Email" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { required: true, type: "password", className: "input", value: password, onChange: (e) => setPassword(e.target.value) }), (0, jsx_runtime_1.jsx)("span", { children: "Password" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { required: true, type: "password", className: "input", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }), (0, jsx_runtime_1.jsx)("span", { children: "Confirm Password" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "courses", children: [(0, jsx_runtime_1.jsx)("p", { children: "Courses to Apply:" }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", name: "course", value: "Machine Learning", checked: selectedCourses.includes('Machine Learning'), onChange: handleCourseChange }), (0, jsx_runtime_1.jsx)("span", { children: "Machine Learning" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", name: "course", value: "Database Programming", checked: selectedCourses.includes('Database Programming'), onChange: handleCourseChange }), (0, jsx_runtime_1.jsx)("span", { children: "Database Programming" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", name: "course", value: "Software Project", checked: selectedCourses.includes('Software Project'), onChange: handleCourseChange }), (0, jsx_runtime_1.jsx)("span", { children: "Software Project" })] })] }), error && (0, jsx_runtime_1.jsx)("p", { className: "error-message", children: error }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "submit", children: "Submit" }), (0, jsx_runtime_1.jsxs)("p", { className: "signin", children: ["Already have an account? ", (0, jsx_runtime_1.jsx)("a", { href: "/login", children: "Signin" })] })] }));
};
exports.default = RegisterPage;
//# sourceMappingURL=page.js.map