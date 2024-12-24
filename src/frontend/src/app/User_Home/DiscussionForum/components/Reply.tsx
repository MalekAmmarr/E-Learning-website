// src/app/User_Home/DiscussionForum/components/Reply.tsx
import React, { useState } from 'react';

interface ReplyProps {
  reply: {
    _id: string;
    content: string;
    createdBy: string;
    createdAt: string;
  };
  userId: string; // ID of the logged-in user
  isInstructor: boolean; // Whether the user is an instructor
  onUpdate: (replyId: string, updatedContent: string) => void; // Function to handle update
  onDelete: (replyId: string) => void; // Function to handle delete
}

const Reply: React.FC<ReplyProps> = ({ reply, userId, isInstructor, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(reply.content);

  const handleSave = () => {
    onUpdate(reply._id, updatedContent);
    setIsEditing(false);
  };

  const canEditOrDelete = reply.createdBy === userId || isInstructor;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      {isEditing ? (
        <div>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            placeholder="Edit your reply"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>{reply.content}</p>
          <small>By: {reply.createdBy} on {new Date(reply.createdAt).toLocaleString()}</small>
        </div>
      )}

      {canEditOrDelete && !isEditing && (
        <div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(reply._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Reply;
