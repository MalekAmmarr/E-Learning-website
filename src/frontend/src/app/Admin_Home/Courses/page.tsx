'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  instructor: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:3000/admins/viewCourses');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
  
    console.log('Attempting to delete course with ID:', courseId);
  
    try {
      const response = await axios.delete(`http://localhost:3000/admins/deleteCourse/${courseId}`, {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Add this if your backend requires authentication
        },
      });
      console.log('Delete response:', response.data);
  
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
      alert('Course deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting course:', err.response?.data || err.message);
      alert('Failed to delete the course. Please check the logs for details.');
    }
  };
  

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Course Management</h1>
        <p className="text-gray-600 mb-6">
          Manage, update, or delete the courses offered on the platform.
        </p>

        {/* Create New Course Button */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={() => alert('Redirect to course creation page')}
          >
            Create New Course
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-4 px-6 text-sm font-medium">ID</th>
                <th className="py-4 px-6 text-sm font-medium">Title</th>
                <th className="py-4 px-6 text-sm font-medium">Instructor</th>
                <th className="py-4 px-6 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">{course.id}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{course.title}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{course.instructor}</td>
                  <td className="py-4 px-6 flex items-center space-x-4">
                    <Link
                      href={`/admin/courses/edit/${course.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 mx-2 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button
            className="px-4 py-2 mx-2 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
