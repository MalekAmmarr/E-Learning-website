'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct for App Router

interface Forum {
  id: string;
  title: string;
  description: string;
}

const DiscussionForum = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use next/navigation's useRouter for App Router

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await fetch('http://localhost:3003/forums'); // Replace with your backend API
        const data = await response.json();
        setForums(data);
      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  const navigateToForum = (forumId: string) => {
    router.push(`/User_Home/DiscussionForum/${forumId}`); // Correct navigation syntax
  };

  return (
    <div>
      <h1>Discussion Forums</h1>
      {loading ? (
        <p>Loading forums...</p>
      ) : (
        <ul>
          {forums.map((forum) => (
            <li key={forum.id}>
              <h2>{forum.title}</h2>
              <p>{forum.description}</p>
              <button onClick={() => navigateToForum(forum.id)}>Join Forum</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiscussionForum;
