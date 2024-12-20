'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import './page.css';

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
        const response = await fetch('http://localhost:3000/admins/students');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStudents(data);
      } catch (error: any) {
        console.error('Error fetching students:', error);
        setError(error.message || 'An unexpected error occurred');
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container">
      <h1>Student List</h1>
      {error && <div className="error-message">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.email}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td className="actions">
                  <Link href={`/students/edit/${student.email}`}>
                    <FaEdit className="icon" /> Edit
                  </Link>
                  <Link
                    href={`/students/delete/${student.email}`}
                    className="delete"
                  >
                    <FaTrash className="icon" /> Delete
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="no-students">
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
