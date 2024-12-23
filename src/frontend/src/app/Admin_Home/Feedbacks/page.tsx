'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';

interface Feedback {
  courseId: string;
  Student_FeedBack_OnCourse: string;
  rating: number;
}

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.get<Feedback[]>('http://localhost:3000/feedback/allfeedbacks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Handle cases where the backend returns a message instead of an array
        if ('message' in response.data) {
          console.error(response.data.message);
          setFeedbacks([]);
        } else {
          setFeedbacks(response.data);
        }
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to fetch feedbacks.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeedbacks();
  }, []);
  

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Course Feedbacks</h1>
        <p className="text-gray-600 mb-6">View feedback from students about the courses.</p>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-4 px-6 text-sm font-medium">Course ID</th>
                <th className="py-4 px-6 text-sm font-medium">Feedback</th>
                <th className="py-4 px-6 text-sm font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                  <td className="py-4 px-6 text-gray-800 font-medium">{feedback.courseId}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{feedback.Student_FeedBack_OnCourse}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{feedback.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
