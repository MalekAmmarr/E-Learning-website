// src/app/User_Home/DiscussionForum/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // REST API base URL
});

export default api;
