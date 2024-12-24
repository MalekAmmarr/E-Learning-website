// // src/app/User_Home/DiscussionForum/components/Thread.tsx
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import api from '../utils/api';
// import Reply from './Reply';

// const Thread = () => {
//   const [replies, setReplies] = useState([]);
//   const [newReply, setNewReply] = useState('');
//   const router = useRouter();
//   const { threadId } = router.query;

//   const userId = 'user123'; // Replace with actual logged-in user ID
//   const isInstructor = userId === 'instructor123'; // Replace with actual instructor check

//   useEffect(() => {
//     if (threadId) {
//       const fetchReplies = async () => {
//         const { data } = await api.get(`/replies/${threadId}`);
//         setReplies(data);
//       };

//       fetchReplies();
//     }
//   }, [threadId]);

//   const handleNewReply = async () => {
//     const replyData = {
//       threadId,
//       createdBy: userId,
//       content: newReply,
//     };

//     const { data } = await api.post('/replies', replyData);
//     setReplies((prev) => [...prev, data]);
//     setNewReply('');
//   };

//   const handleUpdateReply = async (replyId: string, updatedContent: string) => {
//     await api.patch(`/replies/${replyId}`, { content: updatedContent });
//     setReplies((prev) =>
//       prev.map((reply) => (reply._id === replyId ? { ...reply, content: updatedContent } : reply))
//     );
//   };

//   const handleDeleteReply = async (replyId: string) => {
//     await api.delete(`/replies/${replyId}`, { data: { userId } });
//     setReplies((prev) => prev.filter((reply) => reply._id !== replyId));
//   };

//   return (
//     <div>
//       <h1>Replies</h1>
//       {replies.map((reply) => (
//         <Reply
//           key={reply._id}
//           reply={reply}
//           userId={userId}
//           isInstructor={isInstructor}
//           onUpdate={handleUpdateReply}
//           onDelete={handleDeleteReply}
//         />
//       ))}

//       <textarea
//         value={newReply}
//         onChange={(e) => setNewReply(e.target.value)}
//         placeholder="Write your reply..."
//       ></textarea>
//       <button onClick={handleNewReply}>Post Reply</button>
//     </div>
//   );
// };

// export default Thread;
