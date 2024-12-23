'use client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface Thread {
  id: string;
  title: string;
  createdAt: string;
}

const ThreadsList = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { forumId } = router.query;

  useEffect(() => {
    if (!forumId) return;

    const fetchThreads = async () => {
      try {
        const response = await fetch(`http://localhost:3000/forums/${forumId}/threads`);
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [forumId]);

  const createThread = async () => {
    if (!newThreadTitle.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/forums/${forumId}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newThreadTitle }),
      });

      const thread = await response.json();
      setThreads((prev) => [thread, ...prev]);
      setNewThreadTitle('');
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const navigateToThread = (threadId: string) => {
    router.push(`/User_Home/DiscussionForum/${forumId}/${threadId}`);
  };

  return (
    <div>
      <h1>Threads</h1>
      <input
        type="text"
        placeholder="New Thread Title"
        value={newThreadTitle}
        onChange={(e) => setNewThreadTitle(e.target.value)}
      />
      <button onClick={createThread}>Create Thread</button>

      {loading ? (
        <p>Loading threads...</p>
      ) : (
        <ul>
          {threads.map((thread) => (
            <li key={thread.id}>
              <h2 onClick={() => navigateToThread(thread.id)}>{thread.title}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThreadsList;
