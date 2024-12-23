'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Reply {
  id: string;
  content: string;
  createdAt: string;
}

const ThreadReplies = () => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { forumId, threadId } = router.query;

  useEffect(() => {
    if (!threadId) return;

    const fetchReplies = async () => {
      try {
        const response = await fetch(`http://localhost:3000/forums/${forumId}/threads/${threadId}/replies`);
        const data = await response.json();
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [threadId]);

  const postReply = async () => {
    if (!newReply.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3000/forums/${forumId}/threads/${threadId}/replies`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newReply }),
        },
      );

      const reply = await response.json();
      setReplies((prev) => [...prev, reply]);
      setNewReply('');
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  return (
    <div>
      <h1>Replies</h1>
      <textarea
        placeholder="Write a reply..."
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
      />
      <button onClick={postReply}>Post Reply</button>

      {loading ? (
        <p>Loading replies...</p>
      ) : (
        <ul>
          {replies.map((reply) => (
            <li key={reply.id}>
              <p>{reply.content}</p>
              <p>{new Date(reply.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThreadReplies;
