'use client'; // Client-side rendering
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link from next/link

// Define the type for the student
interface Student {
  name: string;
  email: string;
}

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3000/admins/students");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStudents(data);
      } catch (error: any) {
        console.error("Error fetching students:", error);
        setError(error.message || "An unexpected error occurred");
      }
    };

    fetchStudents();
  }, []);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        color: "#333",
        backgroundColor: "#ffffff", // Background set to white
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Softer shadow for a lighter feel
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: "30px",
          color: "#333",
          fontWeight: "600",
        }}
      >
        Student List
      </h1>
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          {error}
        </div>
      )}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          backgroundColor: "#ffffff", // White table background
          border: "1px solid #e0e0e0",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "15px",
                borderBottom: "2px solid #e0e0e0",
                textAlign: "left",
                backgroundColor: "#f9f9f9",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "15px",
                borderBottom: "2px solid #e0e0e0",
                textAlign: "left",
                backgroundColor: "#f9f9f9",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: "15px",
                borderBottom: "2px solid #e0e0e0",
                textAlign: "left",
                backgroundColor: "#f9f9f9",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.email}>
                <td
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #e0e0e0",
                    fontSize: "1rem",
                    color: "#555",
                  }}
                >
                  {student.name}
                </td>
                <td
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #e0e0e0",
                    fontSize: "1rem",
                    color: "#555",
                  }}
                >
                  {student.email}
                </td>
                <td
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    gap: "15px",
                  }}
                >
                  <Link
                    href={`/students/edit/${student.email}`}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "8px 16px",
                      textDecoration: "none",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/students/delete/${student.email}`}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "8px 16px",
                      textDecoration: "none",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontSize: "1rem",
                  color: "#666",
                }}
              >
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListPage;
