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

  const handleDelete = async (email: string) => {
    try {
      // Retrieve the token from sessionStorage
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      // Send delete request to the backend API
      const response = await fetch(
        `http://localhost:3000/admins/students/deleteByEmail/${email}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send token for authorization
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete student. Status: ${response.status}`);
      }

      // Remove the deleted student from the UI
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.email !== email)
      );
    } catch (error: any) {
      console.error('Error deleting student:', error);
      setError(error.message || 'An unexpected error occurred while deleting');
    }
  };

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
                  {/* Update Edit link */}
                  <Link href={`/students/edit?email=${student.email}`}>
                    <FaEdit className="icon" /> Edit
                  </Link>
                  <a
                    className="delete"
                    onClick={() => handleDelete(student.email)}
                  >
                    <FaTrash className="icon" /> Delete
                  </a>
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
