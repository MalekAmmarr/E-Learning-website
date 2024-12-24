'use client';
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsx_runtime_1 = require('react/jsx-runtime');
const react_1 = require('react');
const script_1 = require('next/script');
const navigation_1 = require('next/navigation');
require('./page.css');
const chat = () => {
  const [groupsInfo, setGroupInfo] = (0, react_1.useState)([]);
  const [groupChat, setGroupChat] = (0, react_1.useState)([]);
  const [socket, setSocket] = (0, react_1.useState)(null);
  const [error, setError] = (0, react_1.useState)('');
  const [isLoading, setIsLoading] = (0, react_1.useState)(true);
  const [isLoadingGroupChat, setIsLoadingGroupChat] = (0, react_1.useState)(
    false,
  );
  const [CourseTitle, setCourseTitle] = (0, react_1.useState)();
  const [GroupTitle, SetGroupTitle] = (0, react_1.useState)(
    'No Group Selected',
  );
  const [GroupMembers, SetGroupMembers] = (0, react_1.useState)([]);
  const [isOpen, setIsOpen] = (0, react_1.useState)(false);
  const [message, setMessage] = (0, react_1.useState)('');
  const [Privacy, setPrivacy] = (0, react_1.useState)('');
  const [userData, setUserData] = (0, react_1.useState)();
  const router = (0, navigation_1.useRouter)();
  const handleGetGroups = async (admin, title, privacy) => {
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
  const handleGetPrivateGroups = async (admin, title, privacy) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/chat-history/getPrivateGroups/${admin}/${title}/${privacy}`,
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
  const handleGetGroupChat = async (admin, title, GroupTitle, GroupMembers) => {
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
    admin,
    title,
    GroupTitle,
    GroupMembers,
  ) => {
    try {
      setIsLoadingGroupChat(true);
      SetGroupTitle(title);
      SetGroupMembers(GroupMembers);
      console.log('title : ', title);
      console.log('admin: ', admin);
      const response = await fetch(
        `http://localhost:3000/chat-history/getPrivateGroupChat/${admin}/${title}`,
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
    senderEmail,
    message,
    ProfilePictureUrl,
    timestamp,
    CourseTitle,
    Title,
    privacy,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/chat-history/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderEmail,
            message,
            ProfilePictureUrl,
            CourseTitle,
            Title,
            timestamp: timestamp || new Date(),
            privacy: Privacy,
          }),
        },
      );
      if (response.ok) {
        console.log('Message sent successfully');
        if (Privacy == 'public')
          await handleGetGroupChat(
            senderEmail,
            Title,
            CourseTitle,
            GroupMembers,
          );
        else
          await handleGetPrivateGroupChat(
            senderEmail,
            Title,
            CourseTitle,
            GroupMembers,
          );
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
  const fetchUserDetails = async (email, accessToken) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/getUser/${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched user details:', data);
      setUserData(data);
      return data;
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error;
    }
  };
  (0, react_1.useEffect)(() => {
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
                await handleGetGroups(parsedUser?.email, courseTitle, privacy);
              else
                await handleGetPrivateGroups(
                  parsedUser?.email,
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
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleAddClick = () => {
    console.log('Add icon clicked');
    if (CourseTitle && Privacy) {
      router.push(
        `/User_Home/chat_Hossam/CreateGroup?title=${encodeURIComponent(CourseTitle)}&privacy=${encodeURIComponent(Privacy)}`,
      );
    }
  };
  return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, {
    children: [
      (0, jsx_runtime_1.jsx)('link', {
        href: '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        rel: 'stylesheet',
        id: 'bootstrap-css',
      }),
      (0, jsx_runtime_1.jsx)('link', {
        href: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css',
        rel: 'stylesheet',
        id: 'bootstrap-css',
      }),
      (0, jsx_runtime_1.jsx)(script_1.default, {
        src: 'https://code.jquery.com/jquery-3.6.0.min.js',
        strategy: 'beforeInteractive',
      }),
      (0, jsx_runtime_1.jsx)(script_1.default, {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js',
        strategy: 'beforeInteractive',
      }),
      (0, jsx_runtime_1.jsx)(script_1.default, {
        src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
        strategy: 'afterInteractive',
      }),
      (0, jsx_runtime_1.jsx)(script_1.default, {
        src: 'https://use.fontawesome.com/45e03a14ce.js',
        strategy: 'afterInteractive',
      }),
      (0, jsx_runtime_1.jsx)('div', {
        className: 'main_section',
        children: (0, jsx_runtime_1.jsx)('div', {
          className: 'container',
          children: (0, jsx_runtime_1.jsxs)('div', {
            className: 'chat_container',
            children: [
              (0, jsx_runtime_1.jsx)('div', {
                className: 'col-sm-3 chat_sidebar',
                children: (0, jsx_runtime_1.jsxs)('div', {
                  className: 'row',
                  children: [
                    (0, jsx_runtime_1.jsx)('div', {
                      id: 'custom-search-input',
                      children: (0, jsx_runtime_1.jsxs)('div', {
                        className: 'input-group col-md-12',
                        style: { display: 'flex', alignItems: 'center' },
                        children: [
                          (0, jsx_runtime_1.jsx)('input', {
                            type: 'text',
                            className: 'search-query form-control',
                            placeholder: 'Create Group',
                          }),
                          (0, jsx_runtime_1.jsx)('button', {
                            style: {
                              background: 'none',
                              border: 'none',
                              marginLeft: '10px',
                              cursor: 'pointer',
                            },
                            onClick: handleAddClick,
                            children: (0, jsx_runtime_1.jsx)('span', {
                              style: { fontSize: '4rem', color: '#007bff' },
                              children: '+',
                            }),
                          }),
                        ],
                      }),
                    }),
                    (0, jsx_runtime_1.jsx)('div', {
                      className: 'member_list',
                      children: isLoading
                        ? (0, jsx_runtime_1.jsxs)('div', {
                            className: 'loading-container',
                            children: [
                              (0, jsx_runtime_1.jsx)('div', {
                                className: 'spinner',
                              }),
                              (0, jsx_runtime_1.jsx)('p', {
                                children: 'Loading groups...',
                              }),
                            ],
                          })
                        : (0, jsx_runtime_1.jsx)('ul', {
                            className: 'list-unstyled',
                            children:
                              userData &&
                              CourseTitle &&
                              groupsInfo &&
                              groupsInfo.length > 0 &&
                              groupsInfo.map((group, index) =>
                                (0, jsx_runtime_1.jsxs)(
                                  'li',
                                  {
                                    className: 'left clearfix',
                                    onClick: () => {
                                      if (Privacy == 'public')
                                        handleGetGroupChat(
                                          userData?.email,
                                          group.Title,
                                          CourseTitle,
                                          group.MembersEmail,
                                        );
                                      else
                                        handleGetPrivateGroupChat(
                                          userData?.email,
                                          group.Title,
                                          CourseTitle,
                                          group.MembersEmail,
                                        );
                                    },
                                    children: [
                                      (0, jsx_runtime_1.jsx)('span', {
                                        className: 'chat-img pull-left',
                                        children: (0, jsx_runtime_1.jsx)(
                                          'img',
                                          {
                                            src:
                                              group.ProfilePictureUrl ||
                                              'https://via.placeholder.com/50',
                                            alt: 'Group Avatar',
                                            className: 'img-circle',
                                          },
                                        ),
                                      }),
                                      (0, jsx_runtime_1.jsxs)('div', {
                                        className: 'chat-body clearfix',
                                        children: [
                                          (0, jsx_runtime_1.jsx)('div', {
                                            className: 'header_sec',
                                            children: (0, jsx_runtime_1.jsx)(
                                              'strong',
                                              {
                                                className: 'primary-font',
                                                children: group.Title,
                                              },
                                            ),
                                          }),
                                          (0, jsx_runtime_1.jsx)('div', {
                                            className: 'header_sec',
                                            children: (0, jsx_runtime_1.jsx)(
                                              'p',
                                              {
                                                className: 'pull-right',
                                                children: (() => {
                                                  if (!group.timestamp)
                                                    return 'N/A';
                                                  const date = new Date(
                                                    group.timestamp,
                                                  );
                                                  const today = new Date();
                                                  const isToday =
                                                    date.getDate() ===
                                                      today.getDate() &&
                                                    date.getMonth() ===
                                                      today.getMonth() &&
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
                                                })(),
                                              },
                                            ),
                                          }),
                                          (0, jsx_runtime_1.jsx)('div', {
                                            className: 'contact_sec',
                                            children: (0, jsx_runtime_1.jsxs)(
                                              'a',
                                              {
                                                className: 'primary-font',
                                                children: [
                                                  group.MembersEmail.length + 1,
                                                  ' Members',
                                                ],
                                              },
                                            ),
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  index,
                                ),
                              ),
                          }),
                    }),
                  ],
                }),
              }),
              (0, jsx_runtime_1.jsx)('div', {
                className: 'col-sm-9 message_section',
                children: (0, jsx_runtime_1.jsxs)('div', {
                  className: 'row',
                  children: [
                    (0, jsx_runtime_1.jsxs)('div', {
                      className: 'new_message_head',
                      children: [
                        (0, jsx_runtime_1.jsx)('div', {
                          className: 'pull-left',
                          children: (0, jsx_runtime_1.jsxs)('button', {
                            className: 'group-title-button',
                            children: [
                              (0, jsx_runtime_1.jsx)('i', {
                                className: '',
                                'aria-hidden': 'true',
                              }),
                              ' ',
                              GroupTitle,
                            ],
                          }),
                        }),
                        (0, jsx_runtime_1.jsx)('div', {
                          className: 'pull-right',
                          children: (0, jsx_runtime_1.jsx)('div', {
                            className: 'members-list',
                            children:
                              GroupMembers.length > 0
                                ? GroupMembers.map((member, index) =>
                                    (0, jsx_runtime_1.jsx)(
                                      'div',
                                      {
                                        className: 'member',
                                        children:
                                          index === GroupMembers.length - 1
                                            ? (0, jsx_runtime_1.jsx)(
                                                jsx_runtime_1.Fragment,
                                                {
                                                  children: (0,
                                                  jsx_runtime_1.jsxs)('div', {
                                                    className: 'member-name',
                                                    children: [
                                                      'Admin :',
                                                      ' ',
                                                      GroupMembers[
                                                        GroupMembers.length - 1
                                                      ],
                                                    ],
                                                  }),
                                                },
                                              )
                                            : (0, jsx_runtime_1.jsx)('div', {
                                                className: 'member-name',
                                                children: member,
                                              }),
                                      },
                                      index,
                                    ),
                                  )
                                : (0, jsx_runtime_1.jsx)('p', {
                                    children: 'No members found.',
                                  }),
                          }),
                        }),
                      ],
                    }),
                    (0, jsx_runtime_1.jsx)('div', {
                      className: 'chat_area',
                      children: isLoadingGroupChat
                        ? (0, jsx_runtime_1.jsxs)('div', {
                            className: 'loading-container',
                            children: [
                              (0, jsx_runtime_1.jsx)('div', {
                                className: 'spinner',
                              }),
                              ' ',
                              (0, jsx_runtime_1.jsx)('p', {
                                children: 'Loading chat...',
                              }),
                            ],
                          })
                        : (0, jsx_runtime_1.jsx)('ul', {
                            className: 'list-unstyled',
                            children:
                              groupChat.length === 0
                                ? (0, jsx_runtime_1.jsx)('li', {
                                    className: 'no-message',
                                    children: (0, jsx_runtime_1.jsx)('p', {
                                      children:
                                        'No messages yet have been sent.',
                                    }),
                                  })
                                : groupChat &&
                                  groupChat.length > 0 &&
                                  groupChat.map((msg, index) =>
                                    (0, jsx_runtime_1.jsxs)(
                                      'li',
                                      {
                                        className: `left clearfix ${msg.senderEmail === userData?.email ? 'admin_chat' : ''}`,
                                        children: [
                                          (0, jsx_runtime_1.jsx)('span', {
                                            className: `chat-img1 ${
                                              msg.senderEmail ===
                                              userData?.email
                                                ? 'pull-right'
                                                : 'pull-left'
                                            }`,
                                            children: (0, jsx_runtime_1.jsx)(
                                              'img',
                                              {
                                                src: msg.ProfilePictureUrl,
                                                alt: 'User Avatar',
                                                className: 'img-circle',
                                              },
                                            ),
                                          }),
                                          (0, jsx_runtime_1.jsxs)('div', {
                                            className: `chat-body1 clearfix ${msg.senderEmail === userData?.email ? 'text-right' : ''}`,
                                            children: [
                                              (0, jsx_runtime_1.jsx)('p', {
                                                children: msg.message,
                                              }),
                                              (0, jsx_runtime_1.jsx)('div', {
                                                className: `chat_time ${
                                                  msg.senderEmail ===
                                                  userData?.email
                                                    ? 'pull-left'
                                                    : 'pull-right'
                                                }`,
                                                children: (() => {
                                                  if (!msg.timestamp)
                                                    return 'N/A';
                                                  const date = new Date(
                                                    msg.timestamp,
                                                  );
                                                  const today = new Date();
                                                  const isToday =
                                                    date.getDate() ===
                                                      today.getDate() &&
                                                    date.getMonth() ===
                                                      today.getMonth() &&
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
                                                })(),
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      index,
                                    ),
                                  ),
                          }),
                    }),
                    (0, jsx_runtime_1.jsxs)('div', {
                      className: 'message_write',
                      children: [
                        (0, jsx_runtime_1.jsx)('textarea', {
                          className: 'form-control',
                          placeholder: 'Type a message',
                          value: message,
                          onChange: (e) => setMessage(e.target.value),
                        }),
                        (0, jsx_runtime_1.jsx)('div', {
                          className: 'clearfix',
                        }),
                        (0, jsx_runtime_1.jsxs)('div', {
                          className: 'chat_bottom',
                          children: [
                            (0, jsx_runtime_1.jsxs)('a', {
                              href: '#',
                              className: 'pull-left upload_btn',
                              children: [
                                (0, jsx_runtime_1.jsx)('i', {
                                  className: 'fa fa-cloud-upload',
                                  'aria-hidden': 'true',
                                }),
                                'Add Files',
                              ],
                            }),
                            (0, jsx_runtime_1.jsx)('a', {
                              onClick: () => {
                                if (!userData) {
                                  alert(
                                    'User is not logged in or email is missing.',
                                  );
                                  return;
                                }
                                if (!message.trim()) {
                                  alert("Message can't be empty!");
                                  return;
                                }
                                sendChat(
                                  userData.email,
                                  message,
                                  userData.profilePictureUrl || '',
                                  new Date(),
                                  CourseTitle || 'Default Course',
                                  GroupTitle || 'Default Group',
                                  Privacy,
                                );
                              },
                              className: 'pull-right btn btn-success',
                              children: 'Send',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              ' ',
            ],
          }),
        }),
      }),
    ],
  });
};
exports.default = chat;
//# sourceMappingURL=page.js.map
