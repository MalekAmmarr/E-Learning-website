'use client'; // This marks the component as a client component
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import React from 'react';
import './page.css';
import { User } from '../Notes/page';
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
  ProfilePictureUrl: string; // URL of the sender's profile picture
  timestamp?: Date; // Timestamp of when the message was sent
}
const chat = () => {
  // const [createGroupResponse, setCreateGroupResponse] = useState(null);
  const [groupsInfo, setGroupInfo] = useState<ChatHistory[]>([]);
  const [groupChat, setGroupChat] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGroupChat, setIsLoadingGroupChat] = useState(false);
  const [CourseTitle, setCourseTitle] = useState<string>();
  const [GroupTitle, SetGroupTitle] = useState<string>('No Group Selected');
  const [GroupMembers, SetGroupMembers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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
  const handleGetGroups = async (admin: string, title: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/chat-history/getGroups/${admin}/${title}`,
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
      SetGroupTitle(GroupTitle);
      SetGroupMembers(GroupMembers);
      const response = await fetch(
        `http://localhost:3000/chat-history/getGroupChat/${admin}/${title}`,
      );
      const groupsInfo = await response.json();
      if (groupsInfo) {
        console.log('Group info : ', groupsInfo.Groups);
        setGroupChat(groupsInfo.Groups);
      }
    } catch (err) {
      setError('Failed to get groups: ' + err);
    } finally {
      setIsLoadingGroupChat(false);
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
      const user = sessionStorage.getItem('userData');
      const accessToken = sessionStorage.getItem('authToken');
      if (accessToken) {
        if (user) {
          const queryParams = new URLSearchParams(window.location.search);
          const courseTitle = queryParams.get('title');
          const parsedUser = JSON.parse(user);
          const UpdatedUser = await fetchUserDetails(
            parsedUser.email,
            accessToken,
          );
          if (courseTitle) {
            setCourseTitle(courseTitle);
            await handleGetGroups(UpdatedUser.email, courseTitle);
          }
        }
      }
    };
    Initialize();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddClick = () => {
    console.log('Add icon clicked');
    // const queryParams = new URLSearchParams(window.location.search);
    // const courseTitle = queryParams.get('title');
    // if (courseTitle)
    router.push(`/User_Home/chat_Hossam/CreateGroup?title=Machine Learning`);
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
                            onClick={() =>
                              handleGetGroupChat(
                                userData?.email,
                                CourseTitle,
                                group.Title,
                                group.MembersEmail,
                              )
                            }
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
                            {index === 0 && userData ? (
                              <>
                                <div className="member-name">
                                  {userData?.email}
                                </div>
                                <div className="member-name">{member}</div>
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
                                src={
                                  msg.ProfilePictureUrl ||
                                  'https://via.placeholder.com/50'
                                } // Default image if no profile pic
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
                    placeholder="type a message"
                    defaultValue={''}
                  />
                  <div className="clearfix" />
                  <div className="chat_bottom">
                    <a href="#" className="pull-left upload_btn">
                      <i className="fa fa-cloud-upload" aria-hidden="true" />
                      Add Files
                    </a>
                    <a href="#" className="pull-right btn btn-success">
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
