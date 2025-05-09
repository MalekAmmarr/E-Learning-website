'use client'; // This marks the component as a client component
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import './page.css';

export interface ChatHistory {
  Title: string; // The title of the chat group
  Admin: string; // The admin of the chat group
  CourseTitle: string; // The title of the associated course
  MembersEmail: string[]; // Array of member email addresses
  MembersName: string[]; // Array of member names
  ProfilePictureUrl: string; // URL of the group profile picture
  timestamp: Date; // Timestamp of the group's creation
}

const ChatCreate = () => {
  const [groupDetails, setGroupDetails] = useState<ChatHistory>({
    Title: '',
    Admin: (JSON.parse((sessionStorage.getItem('instructorData'))|| '')).email,
    CourseTitle: '',
    MembersEmail: [], // Admin and members will be handled internally
    MembersName: [], // Admin and members will be handled internally
    ProfilePictureUrl: '',
    timestamp: new Date(),
  });
  const [Admin, setAdminEmail] = useState<string>(''); // Set default admin email
  const [courseTitle, setCourseTitle] = useState<string>(''); // Set default course title
  const [error, setError] = useState('');
  const [createGroupResponse, setCreateGroupResponse] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [loading, setLoading] = useState(false); // State for loading indicator
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
      Admin:Admin,
    }));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !groupDetails.Title ||
      
      !groupDetails.CourseTitle ||
      !groupDetails.ProfilePictureUrl
    ) {
      setError('Please fill in all the required fields.');
      return;
    }

    setLoading(true); // Start loading when form is submitted

    try {
      const response = await fetch(
        'http://localhost:3000/chat-history/create-discussion',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(groupDetails),
        },
      );

      if (response.ok) {
        const successResponse=await response.json()
        setCreateGroupResponse(successResponse);
        //router.push(`/User_Home/chat_Hossam?title=${courseTitle}`); // Navigate to chat page after creating the group
        console.log('Response : ',successResponse);
      } else {
        setError(
          `Failed to create chat: Make sure that all users are enrolled in ${courseTitle}`,
        );
      }
    } catch (err) {
      setError('Error occurred: ' + err);
    } finally {
      setLoading(false); // Stop loading after the response is received
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setGroupDetails((prevDetails) => ({
          ...prevDetails,
          ProfilePictureUrl: base64String, // Store the Base64 string
        }));
        setImagePreview(base64String); // Set the image preview
      };
      reader.readAsDataURL(file); // Convert the image to Base64
    }
  };

  useEffect(() => {
    const Initialize = async () => {
      const user = sessionStorage.getItem('instructorData');
      const accessToken = sessionStorage.getItem('Ins_Token');
      if (accessToken) {
        if (user) {
          const parsedUser = JSON.parse(user);
          setAdminEmail(parsedUser?.email);
          
        }
    } 
      
    };
    Initialize();
  }, []);

  return (
    <div className="container">
      <div className="form_area">
        <p className="title">Create Group</p>
        <form onSubmit={handleCreateGroup}>
          {/* Title Input */}
          <div className="form_group">
            <label className="sub_title" htmlFor="Title">
              Group Title
            </label>
            <input
              placeholder="Enter Group Title"
              className="form_style"
              type="text"
              id="Title"
              name="Title"
              value={groupDetails.Title}
              onChange={handleInputChange}
            />
          </div>

          {/* Course Title Input */}
          <div className="form_group">
            <label className="sub_title" htmlFor="CourseTitle">
              Course Title
            </label>
            <input
              placeholder="Enter Course Title"
              className="form_style"
              type="text"
              id="CourseTitle"
              name="CourseTitle"
              value={groupDetails.CourseTitle}
              onChange={handleInputChange}
            />
          </div>

          {/* Profile Picture Upload Input */}
          <div className="form_group">
            <label className="sub_title" htmlFor="ProfilePictureUrl">
              Profile Picture
            </label>
            <div className="file_input_wrapper">
              <input
                className="file_input"
                type="file"
                id="ProfilePictureUrl"
                name="ProfilePictureUrl"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="ProfilePictureUrl" className="file_input_button">
                Choose File
              </label>
            </div>
            {/* Display the selected image preview */}
            {imagePreview && (
              <div className="image_preview">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="preview_image"
                />
              </div>
            )}
          </div>

          {/* Error message */}
          {error && <div className="error_message">{error}</div>}

          {/* Submit Button */}
          <div className="form_group">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <button
                type="submit"
                className={`btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                Create Group
              </button>
            )}
          </div>
        </form>

        {/* Link to go back to chat */}
        <div>
          <a href="/User_Home/chat" className="link">
            Back To Chat
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChatCreate;
