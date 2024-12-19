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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Student List
      </h1>
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px 15px', border: '1px solid #ddd', textAlign: 'left', backgroundColor: '#f4f4f4', color: '#333' }}>Name</th>
            <th style={{ padding: '12px 15px', border: '1px solid #ddd', textAlign: 'left', backgroundColor: '#f4f4f4', color: '#333' }}>Email</th>
            <th style={{ padding: '12px 15px', border: '1px solid #ddd', textAlign: 'left', backgroundColor: '#f4f4f4', color: '#333' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.email}>
                <td style={{ padding: '12px 15px', border: '1px solid #ddd' }}>{student.name}</td>
                <td style={{ padding: '12px 15px', border: '1px solid #ddd' }}>{student.email}</td>
                <td style={{ padding: '12px 15px', border: '1px solid #ddd', display: 'flex', gap: '10px' }}>
                  <Link href={`/students/edit/${student.email}`} style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '8px 12px',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s ease'
                  }}>
                    Edit
                  </Link>
                  |
                  <Link href={`/students/delete/${student.email}`} style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '8px 12px',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s ease'
                  }}>
                    Delete
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '12px 15px' }}>No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListPage;
