'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Student {
  name: string;
  email: string;
}

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get<Student[]>('http://localhost:3000/admins/students');
        setStudents(response.data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleEditClick = (student: Student) => {
    setEditRow(student.email);
    setEditValues({
      email: student.email,
      name: student.name,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEditing = () => {
    setEditRow(null);
  };

  const saveStudent = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
  
      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }
  
      const updates = {
        email: editValues.email, // The updated email
        name: editValues.name, // The updated name
      };
  
      const originalEmail = editRow; // The original email before editing
  
      // Make the PATCH request to the API with the original email in the route and updates in the body
      const response = await axios.patch(
        `http://localhost:3000/admins/students/updateByEmail/${originalEmail}`, // Use the original email in the route
        updates, // Send the updates in the body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
            'Content-Type': 'application/json',
          },
        }
      );
  
      const updatedStudent = response.data.updatedStudent; // Get the updated student from the response
  
      // Update the local state to reflect the changes
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.email === originalEmail // Match by the original email
            ? { ...student, ...updatedStudent } // Merge updated values
            : student
        )
      );
  
      alert('Student updated successfully.');
      setEditRow(null); // Exit editing mode
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Failed to update the student.');
    }
  };
  
  
  
  

  const handleDelete = async (email: string) => {
    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      await axios.delete(`http://localhost:3000/admins/students/deleteByEmail/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.email !== email)
      );

      alert('Student deleted successfully.');
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete the student.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading students...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Student Management</h1>
        <p className="text-gray-600 mb-6">Manage, update, or delete students.</p>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-4 px-6 text-sm font-medium">Name</th>
                <th className="py-4 px-6 text-sm font-medium">Email</th>
                <th className="py-4 px-6 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <React.Fragment key={student.email}>
                  <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                    <td className="py-4 px-6 text-gray-800 font-medium">{student.name}</td>
                    <td className="py-4 px-6 text-gray-800 font-medium">{student.email}</td>
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.email)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {editRow === student.email && (
                  <tr className="bg-gray-100">
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        name="name"
                        value={editValues.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border-2 border-blue-500 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-black focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        name="email"
                        value={editValues.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border-2 border-blue-500 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-black focus:ring focus:ring-blue-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-4 px-6 flex items-center space-x-2">
                      <button
                        onClick={() => saveStudent()}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentListPage;
