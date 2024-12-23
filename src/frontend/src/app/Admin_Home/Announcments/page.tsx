'use client';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import './page.css'; // Import the CSS file

interface Announcement {
  title: string;
  content: string;
  createdBy: string;
}

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddRow, setShowAddRow] = useState(false); // To toggle add announcement row
  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    title: '',
    content: '',
    createdBy: '',
  });

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
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch('http://localhost:3000/admins/deleteAnnouncement', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete announcement. Status: ${response.status}`);
      }

      setAnnouncements((prev) => prev.filter((announcement) => announcement.title !== title));
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      setError(error.message || 'An unexpected error occurred while deleting');
    }
  };

  const handleAddAnnouncement = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      // Log the data to check if it's correct
      console.log('Sending announcement data:', newAnnouncement);

      const response = await fetch('http://localhost:3000/admins/createAnnouncement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAnnouncement),
      });

      if (!response.ok) {
        throw new Error(`Failed to add announcement. Status: ${response.status}`);
      }

      const addedAnnouncement = await response.json();
      setAnnouncements((prev) => [...prev, addedAnnouncement]);

      // Reset input fields after successfully adding the announcement
      setNewAnnouncement({ title: '', content: '', createdBy: '' });

      // Hide the add row after submitting
      setShowAddRow(false);
    } catch (error: any) {
      console.error('Error adding announcement:', error);
      setError(error.message || 'An unexpected error occurred while adding');
    }
  };

  const handleToggleAddRow = () => {
    // Log to check if the toggle function is called
    console.log("Toggle add row called. Current state:", showAddRow);
    setShowAddRow((prev) => !prev);
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
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <tr key={index}>
                <td>{announcement.title}</td>
                <td>{announcement.content}</td>
                <td>{announcement.createdBy}</td>
                <td className="actions">
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
              <td colSpan={4} className="no-announcements">
                No announcements found
              </td>
            </tr>
          )}

          {/* Render the add row if the "Create Announcement" button is clicked */}
          {showAddRow && (
            <tr className="add-row">
              <td>
                <input
                  type="text"
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  className="add-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Content"
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  className="add-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Created By"
                  value={newAnnouncement.createdBy}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, createdBy: e.target.value })
                  }
                  className="add-input"
                />
              </td>
              <td>
                <button onClick={handleAddAnnouncement} className="add-button">
                  Add
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="create-button-container">
        <button
          className="create-button"
          onClick={handleToggleAddRow} // Toggle the row visibility
        >
          {showAddRow ? 'Cancel' : 'Create Announcement'}
        </button>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
