'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import React from 'react';
import './page.css';
import { User } from '../../page';
import { title } from 'process';
import { timeStamp } from 'console';
// import { io } from 'socket.io-client';
export interface ChatHistory {
  Title: string; // The title of the chat group
  Admin: string; // The admin of the chat group
  CourseTitle: string; // The title of the associated course
  MembersEmail: string[]; // Array of member email addresses
  MembersName: string[]; // Array of member names
  ProfilePictureUrl: string; // URL of the group profile picture

  timestamp: Date; // Timestamp of the group's creation
}
export interface Message {
  senderEmail: string; // Email of the sender
  senderName?: string; // Optional name of the sender
  message: string; // The content of the message
  ProfilePictureUrl?: string; // URL of the sender's profile picture
  timestamp: Date; // Timestamp of when the message was sent
}
const chat = () => {
  // const [createGroupResponse, setCreateGroupResponse] = useState(null);
  const [groupsInfo, setGroupInfo] = useState<ChatHistory[]>([]);
  const [groupChat, setGroupChat] = useState<Message[]>([]);
  const [socket, setSocket] = useState(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGroupChat, setIsLoadingGroupChat] = useState(false);
  const [CourseTitle, setCourseTitle] = useState<string>();
  const [GroupTitle, SetGroupTitle] = useState<string>('No Group Selected');
  const [GroupMembers, SetGroupMembers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [Privacy, setPrivacy] = useState('');

  const [userData, setUserData] = useState<User>();
  const router = useRouter();
  // const handleCreateGroup = async (createGroupData) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/Create', createGroupData);
  //     setCreateGroupResponse(response.data);
  //   } catch (err) {
  //     setError('Failed to create group: ' + err.message);
  //   }
  // };
  const handleGetGroups = async (
    admin: string,
    title: string,
    privacy: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/chat-history/getInstructorGroups/${admin}/${title}/${privacy}`,
      );
      const groupsInfo = await response.json();
      if (groupsInfo) {
        console.log('Group info : ', groupsInfo.Groups);
        setGroupInfo(groupsInfo.Groups);
      }
    } catch (err) {
      setError('Failed to get groups: ' + err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGetPrivateGroups = async (
    admin: string,
    title: string,
    privacy: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/chat-history/getPrivateInstructorGroups/${admin}/${title}/${privacy}`,
      );
      const groupsInfo = await response.json();
      if (groupsInfo) {
        console.log('Group info : ', groupsInfo.Groups);
        setGroupInfo(groupsInfo.Groups);
      }
    } catch (err) {
      setError('Failed to get groups: ' + err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGetGroupChat = async (
    admin: string,
    title: string,
    GroupTitle: string,
    GroupMembers: string[],
  ) => {
    try {
      setIsLoadingGroupChat(true);
      SetGroupTitle(title);
      SetGroupMembers(GroupMembers);
      console.log('title : ', title);
      console.log('admin: ', admin);
      const response = await fetch(
        `http://localhost:3000/chat-history/getInstructorGroupChat/${admin}/${title}`,
      );
      const groupsInfo = await response.json();
      if (groupsInfo) {
        console.log('Group chats : ', groupsInfo.Groups.messages);
        setGroupChat(groupsInfo.Groups.messages);
      }
    } catch (err) {
      setError('Failed to get groups: ' + err);
    } finally {
      setIsLoadingGroupChat(false);
    }
  };
  const handleGetPrivateGroupChat = async (
    admin: string,
    title: string,
    GroupTitle: string,
    GroupMembers: string[],
  ) => {
    try {
      setIsLoadingGroupChat(true);
      SetGroupTitle(title);
      SetGroupMembers(GroupMembers);
      console.log('title : ', title);
      console.log('admin: ', admin);
      const response = await fetch(
        `http://localhost:3000/chat-history/getPrivateInstructorGroupChat/${admin}/${title}`,
      );
      const groupsInfo = await response.json();
      if (groupsInfo) {
        console.log('Group chats : ', groupsInfo.Groups.messages);
        setGroupChat(groupsInfo.Groups.messages);
      }
    } catch (err) {
      setError('Failed to get groups: ' + err);
    } finally {
      setIsLoadingGroupChat(false);
    }
  };
  const sendChat = async (
    senderEmail: string,
    message: string,
    ProfilePictureUrl: string,
    timestamp: Date,
    CourseTitle: string,
    Title: string,
    privacy: string,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/chat-history/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Ensure the server understands JSON format
          },
          body: JSON.stringify({
            senderEmail,
            message,
            ProfilePictureUrl,
            CourseTitle,
            Title,
            timestamp: timestamp || new Date(),
            privacy: Privacy, // Defaults to current date/time if not provided
          }),
        },
      );

      // Check if the response status is successful (2xx)
      if (response.ok) {
        console.log('Message sent successfully');
        if (Privacy == 'public')
          await handleGetGroupChat(
            senderEmail,
            Title,
            CourseTitle,
            GroupMembers,
          ); // Refresh the page or router if necessary
        else
          await handleGetPrivateGroupChat(
            senderEmail,
            Title,
            CourseTitle,
            GroupMembers,
          ); // Refresh the page or router if necessary
      } else {
        const errorData = await response.json();
        throw new Error(
          `Failed to send chat. Error: ${errorData.message || 'Unknown error'}`,
        );
      }
    } catch (err) {
      console.error('Failed to send chat:', err);
    }
  };
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
      setUserData(data); // Update state with user data
      return data; // Return the fetched user data
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error; // Propagate the error for the caller to handle
    }
  };
  useEffect(() => {
    const Initialize = async () => {
      const user = sessionStorage.getItem('instructorData');
      const accessToken = sessionStorage.getItem('Ins_Token');
      if (accessToken) {
        if (user) {
          const queryParams = new URLSearchParams(window.location.search);
          const courseTitle = queryParams.get('title');
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          if (courseTitle) {
            const queryParams = new URLSearchParams(window.location.search);
            const privacy = queryParams.get('privacy');
            setCourseTitle(courseTitle);
            if (privacy) {
              setPrivacy(privacy);
              if (privacy == 'public')
                await handleGetGroups(parsedUser.email, courseTitle, privacy);
              else
                await handleGetPrivateGroups(
                  parsedUser.email,
                  courseTitle,
                  privacy,
                );
            }
          }
        }
      }
    };
    Initialize();
  }, []);
  // useEffect(() => {
  //   console.log('Initializing WebSocket connection...'); // Log when the connection starts

  //   const socketInstance = io('http://localhost:3000/chat'); // Connect to the WebSocket server

  //   // Log when the WebSocket connection is established
  //   socketInstance.on('connect', () => {
  //     console.log('WebSocket connected to the server');
  //   });

  //   // Listen for 'newMessage' events and update the UI in real-time
  //   socketInstance.on('newMessage', (newMessage) => {
  //     console.log('Received new message:', newMessage); // Log the received message

  //     const updatedMessage = {
  //       senderEmail: newMessage.senderEmail,
  //       senderName: newMessage.senderName || '', // Handle missing senderName
  //       message: newMessage.message,
  //       ProfilePictureUrl: newMessage.ProfilePictureUrl,
  //       timestamp: new Date(newMessage.timestamp), // Convert to Date object
  //     };

  //     // Log the updated message before updating the state
  //     console.log('Updated message:', updatedMessage);

  //     // Update the group chat state with the new message
  //     setGroupChat((prevMessages) => {
  //       const updatedMessages = [...prevMessages, updatedMessage];
  //       console.log('Updated group chat state:', updatedMessages); // Log the new state
  //       return updatedMessages;
  //     });
  //   });

  //   // Log when the connection is disconnected
  //   socketInstance.on('disconnect', () => {
  //     console.log('WebSocket disconnected');
  //   });

  //   // Cleanup WebSocket connection when the component unmounts
  //   return () => {
  //     console.log('Cleaning up WebSocket connection');
  //     socketInstance.disconnect();
  //   };
  // }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddClick = () => {
    console.log('Add icon clicked');
    // const queryParams = new URLSearchParams(window.location.search);
    // const courseTitle = queryParams.get('title');
    if (CourseTitle && Privacy) {
      router.push(
        `/User_Home/chat_Hossam/CreateGroup?title=${encodeURIComponent(CourseTitle)}&privacy=${encodeURIComponent(Privacy)}`,
      );
    }
    // else console.log('no course title available');
  };

  return (
    <>
      {/* Bootstrap CSS (4.0 first, as newer version) */}
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />

      {/* Bootstrap CSS (3.3, for compatibility with older styles if needed) */}
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />

      {/* jQuery (latest version first, make sure to load only one version) */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />

      {/* Popper.js (necessary for Bootstrap dropdowns) */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js"
        strategy="beforeInteractive"
      />

      {/* Bootstrap JS (compatible with jQuery and Popper.js) */}
      <Script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
        strategy="afterInteractive"
      />

      {/* FontAwesome (if you need icons) */}
      <Script
        src="https://use.fontawesome.com/45e03a14ce.js"
        strategy="afterInteractive"
      />

      {/*---- Include the above in your HEAD tag --------*/}
      <div className="main_section">
        <div className="container">
          <div className="chat_container">
            <div className="col-sm-3 chat_sidebar">
              <div className="row">
                <div id="custom-search-input">
                  <div
                    className="input-group col-md-12"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <input
                      type="text"
                      className="search-query form-control"
                      placeholder="Create Group"
                    />
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        marginLeft: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={handleAddClick}
                    >
                      <span style={{ fontSize: '4rem', color: '#007bff' }}>
                        +
                      </span>
                    </button>
                  </div>
                </div>

                <div className="member_list">
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                      <p>Loading groups...</p>
                    </div>
                  ) : (
                    <ul className="list-unstyled">
                      {userData &&
                        CourseTitle &&
                        groupsInfo &&
                        groupsInfo.length > 0 &&
                        groupsInfo.map((group, index) => (
                          <li
                            className="left clearfix"
                            key={index}
                            onClick={() => {
                              if (Privacy == 'public') {
                                handleGetGroupChat(
                                  userData?.email,
                                  group.Title,
                                  CourseTitle,
                                  group.MembersEmail,
                                );
                              } else
                                handleGetPrivateGroupChat(
                                  userData?.email,
                                  group.Title,
                                  CourseTitle,
                                  group.MembersEmail,
                                );
                            }}
                          >
                            <span className="chat-img pull-left">
                              <img
                                src={
                                  group.ProfilePictureUrl ||
                                  'https://via.placeholder.com/50'
                                }
                                alt="Group Avatar"
                                className="img-circle"
                              />
                            </span>
                            <div className="chat-body clearfix">
                              <div className="header_sec">
                                <strong className="primary-font">
                                  {group.Title}
                                </strong>
                              </div>
                              <div className="header_sec">
                                <p className="pull-right">
                                  {(() => {
                                    if (!group.timestamp) return 'N/A';

                                    const date = new Date(group.timestamp);
                                    const today = new Date();

                                    const isToday =
                                      date.getDate() === today.getDate() &&
                                      date.getMonth() === today.getMonth() &&
                                      date.getFullYear() ===
                                        today.getFullYear();

                                    if (isToday) {
                                      return `Today at ${date.toLocaleTimeString(
                                        [],
                                        {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        },
                                      )}`;
                                    } else {
                                      return date.toLocaleDateString();
                                    }
                                  })()}
                                </p>
                              </div>
                              <div className="contact_sec">
                                <a className="primary-font">
                                  {group.MembersEmail.length + 1} Members
                                </a>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/*chat_sidebar*/}
            <div className="col-sm-9 message_section">
              <div className="row">
                <div className="new_message_head">
                  <div className="pull-left">
                    <button className="group-title-button">
                      <i className="" aria-hidden="true" /> {GroupTitle}
                    </button>
                  </div>
                  <div className="pull-right">
                    <div className="members-list">
                      {GroupMembers.length > 0 ? (
                        GroupMembers.map((member, index) => (
                          <div key={index} className="member">
                            {/* Conditionally show the email for the first member */}
                            {index === GroupMembers.length - 1 ? (
                              <>
                                <div className="member-name">
                                  Admin :{' '}
                                  {GroupMembers[GroupMembers.length - 1]}
                                </div>
                              </>
                            ) : (
                              <div className="member-name">{member}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No members found.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="chat_area">
                  {isLoadingGroupChat ? (
                    // Show loading spinner if the chat is loading
                    <div className="loading-container">
                      <div className="spinner"></div> {/* Custom spinner */}
                      <p>Loading chat...</p>
                    </div>
                  ) : (
                    <ul className="list-unstyled">
                      {groupChat.length === 0 ? (
                        // If there are no messages, show the no messages message
                        <li className="no-message">
                          <p>No messages yet have been sent.</p>
                        </li>
                      ) : (
                        // If there are messages, render them as usual
                        groupChat &&
                        groupChat.length > 0 &&
                        groupChat.map((msg, index) => (
                          <li
                            key={index}
                            className={`left clearfix ${msg.senderEmail === userData?.email ? 'admin_chat' : ''}`}
                          >
                            <span
                              className={`chat-img1 ${
                                msg.senderEmail === userData?.email
                                  ? 'pull-right'
                                  : 'pull-left'
                              }`}
                            >
                              <img
                                src={msg.ProfilePictureUrl} // Default image if no profile pic
                                alt="User Avatar"
                                className="img-circle"
                              />
                            </span>
                            <div
                              className={`chat-body1 clearfix ${msg.senderEmail === userData?.email ? 'text-right' : ''}`}
                            >
                              <p>{msg.message}</p>
                              <div
                                className={`chat_time ${
                                  msg.senderEmail === userData?.email
                                    ? 'pull-left'
                                    : 'pull-right'
                                }`}
                              >
                                {(() => {
                                  // Check if timestamp exists
                                  if (!msg.timestamp) return 'N/A';

                                  const date = new Date(msg.timestamp); // Convert timestamp to Date object
                                  const today = new Date();

                                  const isToday =
                                    date.getDate() === today.getDate() &&
                                    date.getMonth() === today.getMonth() &&
                                    date.getFullYear() === today.getFullYear();

                                  if (isToday) {
                                    return `Today at ${date.toLocaleTimeString(
                                      [],
                                      {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      },
                                    )}`;
                                  } else {
                                    return date.toLocaleDateString();
                                  }
                                })()}
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                {/*chat_area*/}
                <div className="message_write">
                  <textarea
                    className="form-control"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} // Update state on input change
                  />
                  <div className="clearfix" />
                  <div className="chat_bottom">
                    <a href="#" className="pull-left upload_btn">
                      <i className="fa fa-cloud-upload" aria-hidden="true" />
                      Add Files
                    </a>
                    <a
                      onClick={() => {
                        if (!userData) {
                          alert('User is not logged in or email is missing.');
                          return;
                        }

                        if (!message.trim()) {
                          alert("Message can't be empty!");
                          return;
                        }

                        sendChat(
                          userData.email, // Guaranteed to be a string after the check
                          message,
                          userData.profilePictureUrl || '', // Provide a fallback value
                          new Date(),
                          CourseTitle || 'Default Course', // Provide fallback if CourseTitle is undefined
                          GroupTitle || 'Default Group',
                          Privacy, // Provide fallback if GroupTitle is undefined
                        );
                      }}
                      className="pull-right btn btn-success"
                    >
                      Send
                    </a>
                  </div>
                </div>
              </div>
            </div>{' '}
            {/*message_section*/}
          </div>
        </div>
      </div>
    </>
  );
};
export default chat;
