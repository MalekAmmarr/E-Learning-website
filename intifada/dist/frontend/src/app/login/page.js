'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
require("./page.css");
const LoginPage = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, passwordHash: password }),
            });
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('authToken', data.token);
                router.push('/');
            }
            else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid email or password');
            }
        }
        catch (err) {
            console.error('Login request failed:', err);
            setError('Something went wrong. Please try again.');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "form_main", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("p", { className: "heading", children: "Login" }), (0, jsx_runtime_1.jsxs)("div", { className: "inputContainer", children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 16 16", fill: "#2e2e2e", height: 16, width: 16, xmlns: "http://www.w3.org/2000/svg", className: "inputIcon", children: (0, jsx_runtime_1.jsx)("path", { d: "M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" }) }), (0, jsx_runtime_1.jsx)("input", { placeholder: "Email", id: "email", className: "inputField", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inputContainer", children: [(0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 16 16", fill: "#2e2e2e", height: 16, width: 16, xmlns: "http://www.w3.org/2000/svg", className: "inputIcon", children: (0, jsx_runtime_1.jsx)("path", { d: "M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" }) }), (0, jsx_runtime_1.jsx)("input", { placeholder: "Password", id: "password", className: "inputField", type: "password", value: password, onChange: (e) => setPassword(e.target.value) })] }), error && (0, jsx_runtime_1.jsx)("p", { className: "error-message", children: "Wrong Password or email" }), (0, jsx_runtime_1.jsx)("button", { id: "button", type: "submit", children: "Submit" }), (0, jsx_runtime_1.jsxs)("div", { className: "signupContainer", children: [(0, jsx_runtime_1.jsx)("p", { children: "Don't have an account?" }), (0, jsx_runtime_1.jsx)("a", { href: "/register", children: "Sign up" })] })] }));
};
exports.default = LoginPage;
//# sourceMappingURL=page.js.map