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

const ShowNotes: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Single user object
  const [userNotes, setUserNotes] = useState<String[]>([]);
  const [Note, SetNote] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');

  const [title, setTitle] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      const accessToken = localStorage.getItem('authToken');
      console.log('Title : ', title);
      if (userData) {
        if (accessToken) {
          const parsedData: User = JSON.parse(userData); // Parse the single user object
          setUser(parsedData);
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
  // Fetch notes for the logged-in user
  const fetchUserNotes = async () => {
    if (user?.email) {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const titleFromQuery = queryParams.get('title');
        const response = await fetch('http://localhost:3000/note/showNotes', {
          method: 'POST', // Assuming your API uses POST to accept email in the body
          headers: {
            'Content-Type': 'application/json', // Specify the content type
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Add the Bearer token
          },
          body: JSON.stringify({ Title: titleFromQuery }), // Send the email in the request body
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch notes');
        }

        const note = await response.json();
        console.log('Notes : ', note.notes);
        SetNote(note);
        setUserNotes(note[0].notes);
        return note;
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    }
  };
  useEffect(() => {
    fetchUserNotes();
  }, [user]);

  const handleAddNoteClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() === '') return; // Ensure the note is not empty

    try {
      const response = await fetch('http://localhost:3000/note/addNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentEmail: Note[0].studentEmail,
          Title: Note[0].Title,
          content: newNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add note');
      }

      // Clear the input after successful submission
      setNewNote('');
      // Fetch the updated notes list
      fetchUserNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };
  // Handle delete note
  const handleDeleteNoteClick = async (index: number) => {
    try {
      const response = await fetch('http://localhost:3000/note/deleteNote', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          studentEmail: Note[0].studentEmail,
          Title: Note[0].Title,
          index, // Pass the index to identify which note to delete
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
  const BackButtonClick = () => {
    router.push(`/User_Home/Notes`);
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
              {Note[0]?.Title} :
              <span className="unread-notifications-number">
                {userNotes?.length}
              </span>
            </p>
          </div>

          <div className="col-5 mark-as-read text-end">
            <button
              onClick={BackButtonClick}
              className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
              type="button"
            >
              <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  height="25px"
                  width="25px"
                >
                  <path
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    fill="#000000"
                  />
                  <path
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    fill="#000000"
                  />
                </svg>
              </div>
              <p className="translate-x-2">Go Back</p>
            </button>
          </div>
        </div>
        <div className="row notifications">
          <div className="row notifications">
            <div className="col-12">
              {userNotes && userNotes.length > 0 ? (
                userNotes.map((note, index) => {
                  // Split the note into parts (you can adjust this based on how your note is structured)
                  const noteParts = note.split('|'); // Example: 'Rizky Hasanuda|sent you a private message|5 days ago|Hello, thanks for setting up the Chess Club...'
                  const sender = noteParts[0];
                  const description = noteParts[1];
                  const timestamp = noteParts[2];
                  const message = noteParts.slice(3).join(' '); // Join remaining parts for the message

                  return (
                    <div
                      key={index}
                      className="row single-notification-box read"
                    >
                      <div className="col-1 profile-picture">
                        <img
                          src="/assets/images/shownotes.jpg"
                          alt="profile picture"
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-11 notification-text">
                        <p>
                          <a href="#" className="link name">
                            Note {index + 1}{' '}
                            {/* This shows the note number (index + 1) */}
                          </a>
                          <span className="description">{description}</span>
                          <span className="unread-symbol">•</span>
                        </p>
                        <p className="time">{timestamp}</p>
                        <div className="private-message">{sender}</div>
                        <div className="col-1 text-end">
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteNoteClick(index)}
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
                  );
                })
              ) : (
                <p>No Notes available</p> // Fallback message if there are no notes
              )}
            </div>
          </div>
          <form onSubmit={handleAddNoteClick}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Write a new note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Add Note
              </button>
            </div>
          </form>
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

export default ShowNotes;
