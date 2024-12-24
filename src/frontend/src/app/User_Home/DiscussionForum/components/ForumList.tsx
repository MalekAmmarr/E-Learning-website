// // src/app/User_Home/DiscussionForum/components/ForumList.tsx
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import api from '../utils/api';

// const ForumList = () => {
//   const [forums, setForums] = useState([]);

//   useEffect(() => {
//     const fetchForums = async () => {
//       const { data } = await api.get('/forums');
//       setForums(data);
//     };

//     fetchForums();
//   }, []);

//   return (
//     <div>
//       <h1>Discussion Forums</h1>
//       <ul>
//         {forums.map((forum) => (
//           <li key={forum._id}>
//             <Link href={`/User_Home/DiscussionForum/pages/forum/${forum._id}`}>
//               <a>{forum.name}</a>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ForumList;
