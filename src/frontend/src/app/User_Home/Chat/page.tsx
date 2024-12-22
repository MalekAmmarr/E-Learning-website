'use client';

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentGroup, setCurrentGroup] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [userCourses, setUserCourses] = useState<any[]>([]); // State to hold user's courses

  useEffect(() => {
    const newSocket = io('http://localhost:3002'); // Replace with your backend WebSocket URL
    setSocket(newSocket);

    // Fetch user's courses (replace with your backend API call)
    fetch('http://localhost:3002/api/user/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Replace with actual token
      },
    })
      .then((res) => res.json())
      .then((data) => setUserCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));

    // Fetch groups
    newSocket.emit('getGroups');
    newSocket.on('availableGroups', (groupList) => {
      setGroups(groupList);
      if (groupList.length > 0) setCurrentGroup(groupList[0]?.groupId);
    });

    // Listen for messages
    newSocket.on('chatMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('chatHistory', (history) => {
      setMessages(history);
    });

    newSocket.on('systemMessage', (systemMsg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'System', message: systemMsg },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinGroup = (groupId: string) => {
    if (socket) {
      socket.emit('joinGroup', { groupId, userId: 'YOUR_USER_ID' }); // Replace with the actual user ID
      setCurrentGroup(groupId);
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() !== '') {
      socket.emit('sendMessage', {
        groupId: currentGroup,
        userId: 'YOUR_USER_ID', // Replace with actual user ID
        message: inputMessage.trim(),
      });
      setInputMessage('');
    }
  };

  // Filter groups based on userCourses
  const filteredGroups = groups.filter((group) =>
    userCourses.some((course) => course.courseId === group.courseId)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Platform</h1>
        <p className="text-sm italic">Course-specific chat rooms</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar for Groups */}
        <aside className="w-1/4 bg-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Available Groups</h2>
          <ul className="space-y-2">
            {filteredGroups.map((group) => (
              <li
                key={group.groupId}
                onClick={() => joinGroup(group.groupId)}
                className={`p-2 rounded cursor-pointer ${
                  currentGroup === group.groupId
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-300 text-blue-700'
                }`}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Section */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-300 p-4 text-lg font-semibold text-center text-blue-800">
            {currentGroup ? `Group: ${currentGroup}` : 'Select a Group to Start Chatting'}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span
                  className={`font-bold ${
                    msg.user === 'System' ? 'text-red-600' : 'text-blue-700'
                  }`}
                >
                  {msg.user}:
                </span>
                <span className="text-gray-700">{msg.message}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-gray-300 flex items-center space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded text-gray-800"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
