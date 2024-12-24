// src/app/User_Home/DiscussionForum/utils/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3008', {
  transports: ['websocket'],
});

export default socket;
