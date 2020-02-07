import React from 'react';
const Comment = ({ comment }) => (
  <div className="comment">
    <div className="comment__meta">
      <h5>{comment.name}</h5>
      <span>{new Date(comment.timestamp).toDateString()}</span>
    </div>
    <p className="comment__body">{comment.comment}</p>
  </div>
);
export default Comment;