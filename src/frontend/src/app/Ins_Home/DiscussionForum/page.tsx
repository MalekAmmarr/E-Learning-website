'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link component
import './page.css';

const InstructorPage = () => {
  const [instructor, setInstructor] = useState<any | null>(null);
  const [notificationDetails, setNotificationDetails] = useState({
    courseTitle: '',
    notificationMessage: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch Instructor by Email on page load
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const accessToken = sessionStorage.getItem('Ins_Token');
        const storedInstructor = sessionStorage.getItem('instructorData');

        if (storedInstructor && accessToken) {
          const parsedInstructor = JSON.parse(storedInstructor);

          const res = await fetch(
            `http://localhost:3000/instructor/getbyemail/${parsedInstructor?.email}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!res.ok) {
            throw new Error('Instructor not found or unauthorized');
          }

          const data = await res.json();
          setInstructor(data);
        } else {
          window.location.href = '/Ins_login'; // Redirect manually if necessary
        }
      } catch (err: any) {
        setError(err.message);
        setInstructor(null);
      }
    };

    fetchInstructor();
  }, []);

  // Send Notification to Students
  const sendNotification = async () => {
    try {
      const accessToken = sessionStorage.getItem('Ins_Token');
      setError('');
      setResponseMessage('');

      const res = await fetch(
        'http://localhost:3000/instructor/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            instructorEmail: instructor?.email,
            courseTitle: notificationDetails.courseTitle,
            notificationMessage: notificationDetails.notificationMessage,
          }),
        }
      );

      const rawResponse = await res.text();
      console.log('Raw Response:', rawResponse);

      if (!res.ok) {
        throw new Error(rawResponse || 'Failed to send notification');
      }

      try {
        const data = JSON.parse(rawResponse);
        setResponseMessage(data.message);
      } catch {
        throw new Error('Invalid JSON response from server');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>

      {/* Fetch Instructor by Email */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Instructor Details</h2>
        {instructor ? (
          <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
            <h3 className="font-bold">Instructor Details</h3>
            <p>
              <strong>Name:</strong> {instructor.name}
            </p>
            <p>
              <strong>Email:</strong> {instructor.email}
            </p>
            <p>
              <strong>Courses:</strong>{' '}
              {instructor.Teach_Courses.join(', ')}
            </p>
          </div>
        ) : (
          <p>Loading instructor details...</p>
        )}
      </div>

      {/* Send Notification to Students */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Send Notification to Students</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={notificationDetails.courseTitle}
            onChange={(e) =>
              setNotificationDetails({
                ...notificationDetails,
                courseTitle: e.target.value,
              })
            }
            placeholder="Course Title"
            className="border border-gray-300 rounded px-3 py-2"
          />
          <textarea
            value={notificationDetails.notificationMessage}
            onChange={(e) =>
              setNotificationDetails({
                ...notificationDetails,
                notificationMessage: e.target.value,
              })
            }
            placeholder="Notification Message"
            className="border border-gray-300 rounded px-3 py-2"
            rows={4}
          />
          <button
            onClick={sendNotification}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Send Notification
          </button>
        </div>
      </div>

      {/* Response/Error Messages */}
      {responseMessage && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded text-green-800">
          {responseMessage}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded text-red-800">
          {error}
        </div>
      )}

      {/* New Buttons for Navigation */}
      <div className="mt-6 flex gap-4">
        <Link
          href="/Ins_Home/DiscussionForum/group-chat"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Join group chat
        </Link>
        <Link
          href="/Ins_Home/DiscussionForum/create-group"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create group
        </Link>
      </div>
    </div>
  );
};

export default InstructorPage;
