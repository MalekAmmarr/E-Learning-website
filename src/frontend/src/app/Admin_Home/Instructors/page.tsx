'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import './page.css';

interface Instructor {
  name: string;
  email: string;
  Teach_Courses: string[]; // Array of courses
  Certificates: string;    // String for certificates
}

const InstructorListPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch('http://localhost:3000/admins/instructors');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setInstructors(data);
      } catch (error: any) {
        console.error('Error fetching instructors:', error);
        setError(error.message || 'An unexpected error occurred');
      }
    };

    fetchInstructors();
  }, []);

  const handleDelete = async (email: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admins/instructors/${email}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete instructor. Status: ${response.status}`);
      }

      // Remove the deleted instructor from the UI
      setInstructors((prevInstructors) =>
        prevInstructors.filter((instructor) => instructor.email !== email)
      );
    } catch (error: any) {
      console.error('Error deleting instructor:', error);
      setError(error.message || 'An unexpected error occurred while deleting');
    }
  };

  return (
    <div className="container">
      <h1>Instructor List</h1>
      {error && <div className="error-message">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Certificates</th>
            <th>Teach Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.length > 0 ? (
            instructors.map((instructor) => (
              <tr key={instructor.email}>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                {/* Display certificates */}
                <td>{instructor.Certificates}</td>
                {/* Display teach courses as a comma-separated list */}
                <td>{instructor.Teach_Courses.join(', ')}</td>
                <td className="actions">
                  {/* Edit link */}
                  <Link href={`/instructors/edit?email=${instructor.email}`} className="edit-button">
                    <FaEdit className="icon" /> Edit
                  </Link>
                  {/* Delete button */}
                  <button className="delete-button" onClick={() => handleDelete(instructor.email)}>
                    <FaTrash className="icon" /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-instructors">
                No instructors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorListPage;
