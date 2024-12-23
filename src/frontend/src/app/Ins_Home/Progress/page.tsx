'use client';
import { useSearchParams } from 'next/navigation';
import router from 'next/router';
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // For PDF generation
import './page.css';

interface Student {
  name: string;
  email: string;
  age: string;
  coursescores: { courseTitle: string; score: number }[];
  appliedCourses: string[];
}

interface ScoreCategories {
  belowAverage: number;
  average: number;
  aboveAverage: number;
  excellent: number;
}

const CourseStatisticsPage: React.FC = () => {
  const [insdata, setInsData] = useState<any>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [enrolledCount, setEnrolledCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [scoreCategories, setScoreCategories] = useState<ScoreCategories>({
    belowAverage: 0,
    average: 0,
    aboveAverage: 0,
    excellent: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const title = searchParams.get('title');
  
  if (!title) {
    throw new Error('Invalid course title');
  }

  const CourseTitle = decodeURIComponent(title);

  useEffect(() => {
    // Fetching the instructor data and students' statistics when the component mounts
    fetchEnrolledStudents();
    fetchCompletedStudents();
    fetchScoreCategories();
  }, [CourseTitle]); // Dependency array ensures this runs when the CourseTitle changes

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem('Ins_Token'); // Updated to match token naming convention
      const storedInstructor = sessionStorage.getItem('instructorData'); // Updated to match instructor data storage key
      console.log('Access Token:', accessToken);

      if (storedInstructor && accessToken) {
        const parsedInstructor = JSON.parse(storedInstructor);
        setInsData(parsedInstructor);

        console.log('Access Token:', accessToken);
        console.log('Instructor Email:', parsedInstructor?.email);
        const response = await fetch(`http://localhost:3000/instructor/enrolled-students/${CourseTitle}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch enrolled students');
        const data = await response.json();
        setEnrolledStudents(data.students);
        setEnrolledCount(data.totalCount);
      } else {
        // Redirect to login if instructor data or token is missing
        router.push('/Ins_login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedStudents = async () => {
    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem('Ins_Token');
      const response = await fetch(`http://localhost:3000/instructor/completed-students/${CourseTitle}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch completed students');
      const data = await response.json();
      setCompletedCount(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchScoreCategories = async () => {
    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem('Ins_Token');
      const response = await fetch(`http://localhost:3000/instructor/students-score/${CourseTitle}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch score categories');
      const data = await response.json();
      setScoreCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Course Statistics', 20, 20);
    doc.setFontSize(12);
    doc.text(`Course Title: ${CourseTitle}`, 20, 30);
    doc.text(`Total Enrolled: ${enrolledCount}`, 20, 40);
    doc.text(`Total Completed: ${completedCount}`, 20, 50);
    doc.text(`Score Categories:`, 20, 60);
    doc.text(`Below Average: ${scoreCategories.belowAverage}`, 20, 70);
    doc.text(`Average: ${scoreCategories.average}`, 20, 80);
    doc.text(`Above Average: ${scoreCategories.aboveAverage}`, 20, 90);
    doc.text(`Excellent: ${scoreCategories.excellent}`, 20, 100);

    doc.text('Enrolled Students:', 20, 110);
    enrolledStudents.forEach((student, index) => {
      doc.text(`${student.name} (${student.email}) - Age: ${student.age}`, 20, 120 + (index * 10));
    });

    doc.save('course_statistics.pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Statistics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <section className="mb-4">
            <h2 className="text-xl font-semibold">Enrolled Students</h2>
            <p>Total Enrolled: {enrolledCount}</p>
            <ul>
              {enrolledStudents.map((student, index) => (
                <li key={index}>
                  {student.name} ({student.email}) - Age: {student.age}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold">Completed Students</h2>
            <p>Total Completed: {completedCount}</p>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold">Score Categories</h2>
            <ul>
              <li>Below Average: {scoreCategories.belowAverage}</li>
              <li>Average: {scoreCategories.average}</li>
              <li>Above Average: {scoreCategories.aboveAverage}</li>
              <li>Excellent: {scoreCategories.excellent}</li>
            </ul>
          </section>
          <div className="mb-4">
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Download as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseStatisticsPage;
