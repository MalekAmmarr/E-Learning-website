'use client'; // This marks the component as a client component
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link from Next.js for navigation

export interface User {
  email: string;
  name: string;
  age: string;
  passwordHash: string;
  profilePictureUrl?: string;
  appliedCourses: string[];
  acceptedCourses: string[];
  courseScores: { courseTitle: string; score: number }[];
  Notifiction: string[];
  feedback: Array<{
    quizId: string;
    courseTitle: string;
    feedback: Array<{ question: string; feedback: string }>;
  }>;
  Notes: string[];
  GPA: number;
  certificates: Certificate[];
}

interface Certificate {
  name: string;
  courseTitle: string;
  certificateImageUrl: string;
}

const StudentCertificate = () => {
  const [certificateImageUrl, setCertificateImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<Certificate[]>([]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setError(null);

      // Retrieve token and user data from sessionStorage
      const accessToken = sessionStorage.getItem('authToken');
      const user = sessionStorage.getItem('userData');

      if (accessToken && user) {
        const parsedUser = JSON.parse(user); // TypeScript interface for user data

        const studentNameFromToken = parsedUser.name; // Assuming the user data contains the name
        console.log('Student Name:', studentNameFromToken); // Log the student name

        setStudentName(studentNameFromToken);

        if (studentNameFromToken) {
          try {
            // Fetch the certificate image URL using studentName and courseTitle
            const response = await fetch(
              `http://localhost:3000/users/certificate/${studentNameFromToken}/Machine Learning`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`, // Add the token for authorization
                },
              }
            );

            if (!response.ok) {
              throw new Error('Failed to fetch certificate image');
            }

            const data = await response.json();
            console.log('user : ', data.certificates);
            setCertificate(data.certificates); // Assuming the response contains this field
          } catch (error: any) {
            setError(error.message || 'An error occurred');
          }
        } else {
          setError('Student name or course title is missing.');
        }
      } else {
        setError('No user data found. Please log in.');
      }

      setLoading(false);
    };

    initialize();
  }, []);

  if (loading) return <div className="text-center text-xl text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Student Certificate</h1>
      {certificate.length > 0 ? (
        <div className="space-y-6">
          {certificate.map((cert, index) => (
            <div key={index} className="max-w-3xl w-full bg-gray-50 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-medium text-gray-800 mb-4">
                Certificate for {cert.name} in {cert.courseTitle}
              </h2>
              <div className="flex justify-center mb-4">
                <img
                  src={cert.certificateImageUrl}
                  alt={`Certificate for ${cert.name} in ${cert.courseTitle}`}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600">
          <p>No certificates found for {studentName}.</p>
        </div>
      )}
      <div className="mt-8">
        <Link
          href="/User_Home"
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default StudentCertificate;
