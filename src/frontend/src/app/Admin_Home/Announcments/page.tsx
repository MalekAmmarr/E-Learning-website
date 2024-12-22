'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './page.css'; // Import the CSS file
import Cookies from 'js-cookie';

interface Announcement {
  title: string;
  content: string;
}

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:3000/admins/getAnnouncement');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (error: any) {
        console.error('Error fetching announcements:', error);
        setError(error.message || 'An unexpected error occurred');
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (title: string) => {
    try {
      // Retrieve the token from sessionStorage
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch('http://localhost:3000/admins/deleteAnnouncement', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify({ title }),
      });

      

      if (!response.ok) {
        throw new Error(`Failed to delete announcement. Status: ${response.status}`);
      }

      // Remove the deleted announcement from the UI
      setAnnouncements((prev) => prev.filter((announcement) => announcement.title !== title));
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      setError(error.message || 'An unexpected error occurred while deleting');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-header">Announcements</h1>
      {error && <div className="error-message">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <tr key={index}>
                <td>{announcement.title}</td>
                <td>{announcement.content}</td>
                <td className="actions">
                  <Link href={`/announcements/edit?title=${announcement.title}`}>
                    <button className="edit-button">
                      <FaEdit className="icon" /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(announcement.title)}
                    className="delete-button"
                  >
                    <FaTrash className="icon" /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="no-announcements">
                No announcements found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementsPage;
