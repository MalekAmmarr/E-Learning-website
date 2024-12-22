'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import React from 'react';

interface Course {
  courseId: number;
  title: string;
  instructorName: string;
  isArchived?: boolean;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [archivedCourses, setArchivedCourses] = useState<Course[]>([]);
  const [showArchivedCourses, setShowArchivedCourses] = useState(false); // State for toggling archived courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for editing
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    courseId: '',
    title: '',
    instructorName: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:3000/admins/viewCourses');
        const activeCourses = response.data.filter((course) => !course.isArchived);
        setCourses(activeCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchArchivedCourses = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await axios.get<Course[]>('http://localhost:3000/admins/viewCourses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const archivedCourses = response.data.filter((course) => course.isArchived);
      setArchivedCourses(archivedCourses);
    } catch (err: any) {
      console.error('Error fetching archived courses:', err.response?.data || err.message);
      alert('Failed to fetch archived courses. Please check the logs for details.');
    }
  };

  const handleEditClick = (course: Course) => {
    setEditRow(course.courseId);
    setEditValues({
      courseId: course.courseId.toString(),
      title: course.title,
      instructorName: course.instructorName,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEditing = () => {
    setEditRow(null);
  };

  const deleteCourse = useCallback(async (title: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      await axios.delete('http://localhost:3000/admins/deleteCourse', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { title },
      });

      setCourses((prevCourses) => prevCourses.filter((course) => course.title !== title));
      alert('Course deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting course:', err.response?.data || err.message);
      alert('Failed to delete the course. Please check the logs for details.');
    }
  }, []);

  const saveCourse = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const updates = {
        title: editValues.title,
        instructorName: editValues.instructorName,
      };

      const response = await axios.patch(
        'http://localhost:3000/admins/updateCourse',
        {
          courseId: editValues.courseId,
          updates,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedCourse = response.data.updatedCourse;

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId.toString() === updatedCourse.courseId
            ? { ...course, ...updates }
            : course
        )
      );

      alert('Course updated successfully.');
      setEditRow(null);
    } catch (err: any) {
      console.error('Error updating course:', err.response?.data || err.message);
      alert('Failed to update the course. Please check the logs for details.');
    }
  };

  const archiveCourse = async (courseId: string) => {
    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await axios.patch(
        'http://localhost:3000/admins/archiveCourse',
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const archivedCourse = response.data.archivedCourse;

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId.toString() !== courseId)
      );

      setArchivedCourses((prevArchivedCourses) => [...prevArchivedCourses, archivedCourse]);
      alert('Course archived successfully.');
    } catch (err: any) {
      console.error('Error archiving course:', err.response?.data || err.message);
      alert('Failed to archive the course. Please check the logs for details.');
    }
  };

  const restoreCourse = async (courseId: string) => {
    try {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await axios.patch(
        'http://localhost:3000/admins/restoreCourse',
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const restoredCourse = response.data.restoredCourse;

      setArchivedCourses((prevArchivedCourses) =>
        prevArchivedCourses.filter((course) => course.courseId.toString() !== courseId)
      );

      setCourses((prevCourses) => [...prevCourses, restoredCourse]);
      alert('Course restored successfully.');
    } catch (err: any) {
      console.error('Error restoring course:', err.response?.data || err.message);
      alert('Failed to restore the course. Please check the logs for details.');
    }
  };

  const toggleArchivedCourses = () => {
    setShowArchivedCourses((prev) => !prev);
    if (!showArchivedCourses) {
      fetchArchivedCourses();
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Course Management</h1>
        <p className="text-gray-600 mb-6">Manage, update, or delete the courses offered on the platform.</p>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-4 px-6 text-sm font-medium">Course ID</th>
                <th className="py-4 px-6 text-sm font-medium">Title</th>
                <th className="py-4 px-6 text-sm font-medium">Instructor</th>
                <th className="py-4 px-6 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <React.Fragment key={course.courseId}>
                  <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                    <td className="py-4 px-6 text-gray-800 font-medium">{course.courseId}</td>
                    <td className="py-4 px-6 text-gray-800 font-medium">{course.title}</td>
                    <td className="py-4 px-6 text-gray-800 font-medium">{course.instructorName}</td>
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <button
                        onClick={() => handleEditClick(course)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCourse(course.title)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => archiveCourse(course.courseId.toString())}
                        className="text-yellow-600 hover:underline font-medium"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>

                  {editRow === course.courseId && (
                    <tr className="bg-gray-100">
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          name="courseId"
                          value={editValues.courseId}
                          onChange={handleInputChange}
                          className="w-full p-2 border-2 border-blue-500 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-black focus:ring focus:ring-blue-300 focus:outline-none"
                          disabled
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          name="title"
                          value={editValues.title}
                          onChange={handleInputChange}
                          className="w-full p-2 border-2 border-blue-500 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-black focus:ring focus:ring-blue-300 focus:outline-none"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          name="instructorName"
                          value={editValues.instructorName}
                          onChange={handleInputChange}
                          className="w-full p-2 border-2 border-blue-500 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-black focus:ring focus:ring-blue-300 focus:outline-none"
                        />
                      </td>
                      <td className="py-4 px-6 flex items-center space-x-2">
                        <button
                          onClick={saveCourse}
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

        <br />
        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={toggleArchivedCourses}
          >
            {showArchivedCourses ? 'Hide Archived Courses' : 'View Archived Courses'}
          </button>
        </div>

        {showArchivedCourses && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Archived Courses</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-4 px-6 text-sm font-medium">Course ID</th>
                    <th className="py-4 px-6 text-sm font-medium">Title</th>
                    <th className="py-4 px-6 text-sm font-medium">Instructor</th>
                    <th className="py-4 px-6 text-sm font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedCourses.map((course, index) => (
                    <tr
                      key={course.courseId}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium">{course.courseId}</td>
                      <td className="py-4 px-6 text-gray-800 font-medium">{course.title}</td>
                      <td className="py-4 px-6 text-gray-800 font-medium">{course.instructorName}</td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => restoreCourse(course.courseId.toString())}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
