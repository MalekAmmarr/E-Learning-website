// // src/app/User_Home/DiscussionForum/components/Forum.tsx
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import api from '../utils/api';

// const Forum = () => {
//   const [threads, setThreads] = useState([]);
//   const router = useRouter();
//   const { forumId } = router.query;

//   useEffect(() => {
//     if (forumId) {
//       const fetchThreads = async () => {
//         const { data } = await api.get(`/threads/${forumId}`);
//         setThreads(data);
//       };

//       fetchThreads();
//     }
//   }, [forumId]);

//   return (
//     <div>
//       <h1>Threads</h1>
//       <ul>
//         {threads.map((thread) => (
//           <li key={thread._id}>
//             <Link href={`/User_Home/DiscussionForum/pages/thread/${thread._id}`}>
//               <a>{thread.title}</a>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Forum;
