'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'; // Import icons
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
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; email: string; Teach_Courses: string; Certificates: string }>({
    name: '',
    email: '',
    Teach_Courses: '',
    Certificates: ''
  });

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
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch(
        `http://localhost:3000/admins/instructors/${email}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete instructor. Status: ${response.status}`);
      }

      setInstructors((prevInstructors) =>
        prevInstructors.filter((instructor) => instructor.email !== email)
      );
    } catch (error: any) {
      console.error('Error deleting instructor:', error);
      setError(error.message || 'An unexpected error occurred while deleting');
    }
  };

  const handleEditClick = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setEditValues({
      name: instructor.name,
      email: instructor.email,
      Teach_Courses: instructor.Teach_Courses.join(', '), // Join the array into a string for easier editing
      Certificates: instructor.Certificates,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveInstructor = async (email: string) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const updates = {
        name: editValues.name,
        // Split the Teach_Courses string back into an array
        Teach_Courses: editValues.Teach_Courses.split(',').map((course) => course.trim()), 
        Certificates: editValues.Certificates,
      };

      const response = await fetch(
        `http://localhost:3000/admins/instructors/${email}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update instructor. Status: ${response.status}`);
      }

      setInstructors((prevInstructors) =>
        prevInstructors.map((instructor) =>
          instructor.email === email ? { ...instructor, ...updates } : instructor
        )
      );

      setEditingInstructor(null);
      alert('Instructor updated successfully.');
    } catch (error: any) {
      console.error('Error updating instructor:', error);
      alert('Failed to update instructor. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingInstructor(null);
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
              <React.Fragment key={instructor.email}>
                <tr>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.Certificates}</td>
                  <td>{instructor.Teach_Courses.join(', ')}</td>
                  <td className="actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(instructor)}
                    >
                      <FaEdit className="icon" /> Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(instructor.email)}
                    >
                      <FaTrash className="icon" /> Delete
                    </button>
                  </td>
                </tr>

                {/* Editable row */}
                {editingInstructor?.email === instructor.email && (
                  <tr>
                    <td colSpan={5}>
                      <div className="edit-row">
                        <div className="edit-inputs">
                          <input
                            type="text"
                            name="name"
                            value={editValues?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Name"
                            className="edit-input"
                          />
                          <input
                            type="text"
                            name="Teach_Courses"
                            value={editValues?.Teach_Courses || ''}
                            onChange={handleInputChange}
                            placeholder="Teach Courses"
                            className="edit-input"
                          />
                          <input
                            type="text"
                            name="Certificates"
                            value={editValues?.Certificates || ''}
                            onChange={handleInputChange}
                            placeholder="Certificates"
                            className="edit-input"
                          />
                        </div>
                        <div className="edit-actions">
                          <button
                            className="save-button"
                            onClick={() => saveInstructor(instructor.email)}
                          >
                            <FaSave /> Save
                          </button>
                          <button className="cancel-button" onClick={cancelEdit}>
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
