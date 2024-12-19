'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Define the Course type
interface Course {
  id: number;
  title: string;
  instructor: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]); // Explicitly type the state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('/api/courses'); // Use the Course[] type for API response
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

  // Handle course deletion
  const deleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`/api/courses/${courseId}`); // Replace with your backend DELETE endpoint
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
      alert('Course deleted successfully.');
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete the course.');
    }
  };

  if (loading) {
    return <div className="p-8">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4">Course Management</h1>
      <p className="text-gray-600 mb-6">
        View, update, archive, or delete courses offered on the platform.
      </p>

      {/* Create New Course Button */}
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          onClick={() => alert('Redirect to course creation page')}
        >
          Create New Course
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Instructor</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{course.id}</td>
                <td className="border border-gray-300 px-4 py-2">{course.title}</td>
                <td className="border border-gray-300 px-4 py-2">{course.instructor}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/admin/courses/edit/${course.id}`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-500 hover:underline"
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
      <div className="flex justify-center mt-4">
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 disabled:opacity-50" disabled>
          Previous
        </button>
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50" disabled>
          Next
        </button>
      </div>
    </div>
  );
}
