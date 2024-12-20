// pages/notification.tsx
'use client';
import React from 'react';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import './page.css';
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
}
export interface Note {
  studentEmail: string; // The unique email of the student
  Title: string; // The title of the note
  profilePictureUrl?: string; // Optional URL for the student's profile picture
  content?: string;
  notes: string[]; // Array of string notes
  timestamp: Date; // Timestamp of when the note was created or updated
}

const Notes: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Single user object
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const router = useRouter();
  const fetchUserDetails = async (
    email: string,
    accessToken: string,
  ): Promise<User> => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/getUser/${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Assuming Bearer token is used for authorization
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data: User = await response.json();
      console.log('Fetched user details:', data); // Debugging: Log the fetched user details
      setUser(data); // Update state with user data
      return data; // Return the fetched user data
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error; // Propagate the error for the caller to handle
    }
  };

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('userData');
      const accessToken = sessionStorage.getItem('authToken');
      if (userData) {
        if (accessToken) {
          const parsedData: User = JSON.parse(userData); // Parse the single user object
          fetchUserDetails(parsedData.email, accessToken);
        } else router.push('login');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(
        'Failed to retrieve or parse user data from localStorage',
        err,
      );
      router.push('/login');
    }
  }, [router]);
  const fetchUserNotes = async () => {
    if (user?.email) {
      try {
        const response = await fetch('http://localhost:3000/note/getNotes', {
          method: 'POST', // Assuming your API uses POST to accept email in the body
          headers: {
            'Content-Type': 'application/json', // Specify the content type
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Add the Bearer token
          },
          body: JSON.stringify({ studentEmail: user?.email }), // Send the email in the request body
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch notes');
        }

        const notes = await response.json();

        setUserNotes(notes);
        return notes;
      } catch (error) {
        console.error('Error fetching notes:', error);
        return null;
      }
    }
  };

  // Fetch notes for the logged-in user
  useEffect(() => {
    fetchUserNotes();
  }, [user]);
  const handleAddNoteClick = () => {
    router.push('/User_Home/Notes/AddNotes'); // Navigate to Add Notes page
  };
  // Function to handle note title click
  const handleNoteTitleClick = (noteTitle: string) => {
    router.push(
      `/User_Home/Notes/ShowNotes?title=${encodeURIComponent(noteTitle)}`,
    );
  };
  // Handle delete note
  const handleDeleteNoteClicks = async (
    studentEmail: string,
    Title: string,
  ) => {
    try {
      const response = await fetch('http://localhost:3000/note/deleteAllNote', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentEmail: studentEmail,
          Title: Title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete note');
      }

      // Refresh the notes after successful deletion
      fetchUserNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />{' '}
      {/* displays site properly based on user's device */}
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/assets/images/favicon-32x32.png"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/dist/styles.css" />
      <title>Notes Page</title>
      {/* Feel free to remove these styles or customise in your own stylesheet 👍 */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n    .attribution { font-size: 11px; text-align: center; }\n    .attribution a { color: hsl(228, 45%, 44%); }\n  ',
        }}
      />
      <div className="container notifications-container shadow">
        <div className="row header">
          <div className="col-7">
            <p className="title">
              Your Notes:
              <span className="unread-notifications-number">
                {userNotes?.length}
              </span>
            </p>
          </div>

          <div className="col-5 mark-as-read text-end">
            <button
              onClick={handleAddNoteClick}
              className="group cursor-pointer outline-none hover:rotate-90 duration-300"
              title="Add New"
            >
              <svg
                className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                viewBox="0 0 24 24"
                height="50px"
                width="50px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeWidth="1.5"
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                />
                <path strokeWidth="1.5" d="M8 12H16" />
                <path strokeWidth="1.5" d="M12 16V8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="row notifications">
          <div className="col-12">
            {userNotes &&
              userNotes.map((note, index) => (
                <div key={index} className="row single-notification-box unread">
                  <div className="col-1 profile-picture">
                    <img
                      src={
                        '/assets/images/Notes.jpg' // Image for "Congratulations"
                      }
                      alt="profile picture"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-11 notification-text">
                    <p>
                      <a
                        className="link name"
                        onClick={() => handleNoteTitleClick(note.Title)}
                      >
                        {note.Title}
                      </a>

                      <span className="unread-symbol">•</span>
                    </p>
                    <p className="time">
                      {new Date(note.timestamp).toLocaleString()}{' '}
                      {/* Format timestamp */}
                    </p>
                    <div className="col-1 text-end">
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDeleteNoteClicks(note.studentEmail, note.Title)
                        }
                      >
                        <span className="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 0a.5.5 0 0 1 .5.5V1h5V.5a.5.5 0 0 1 1 0V1h2a1 1 0 0 1 1 1v1h-1v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3H1V2a1 1 0 0 1 1-1h2V.5a.5.5 0 0 1 .5-.5zM4 4v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4H4z" />
                          </svg>
                        </span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/*
      
    
    */}
      <div className="attribution">
        Coded by <a href="#">Omar Hossam</a>.
      </div>
      {/* Add jQuery */}
      <Script
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        strategy="afterInteractive" // Load after the page is interactive
      />
      {/* Add Bootstrap JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Add your custom unread.js script */}
      <Script src="/App/js/unread.js" strategy="afterInteractive" />
    </>
  );
};

export default Notes;
